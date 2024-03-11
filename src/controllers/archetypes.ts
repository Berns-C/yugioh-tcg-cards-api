import { Request, Response, NextFunction } from 'express';
import slugifyName from '../lib/slugify';
import Archetypes from '../models/Archetypes';
import Cards from '../models/Cards';
import asyncHandler from '../custom-middleware/async';
import {
  validateAndFindID,
  validateArrData,
} from '../custom-middleware/validations';
import { findOneByString } from '../custom-middleware/find';
import {
  getValidProperties,
  formPagination,
  formRegexObj,
  defaultOperation,
  getFirstOperation,
  formOperationObj,
} from '../utilities/object-format';
import { getOriginalUrl } from '../utilities/texts';
import { handleLimit } from '../utilities/db-util';
import { handleOffsetSkipCount } from '../utilities/numbers';
import {
  ARCHETYPES_QUERIES_ARR,
  ARCHETYPE_UPDATABLE_PROPERTIES,
} from '../data/constant_variables';

interface IQueries {
  name?: string;
  cards?: string | object;
  offset?: string;
  limit?: string;
}

export const addArchetypes = validateArrData(
  asyncHandler(async ({ body }: Request, res: Response, next: NextFunction) => {
    const data = Array.isArray(body)
      ? await Archetypes.insertMany(body, { ordered: false })
      : await Archetypes.create(body);

    res.status(201).json({ success: true, data });
  }),
  Archetypes
);

export const getArchetypeByID = validateAndFindID(
  async (req: Request, res: Response, next: NextFunction, data) => {
    res.status(200).json({ success: true, data });
  },
  Archetypes
);
export const getArchetypeByName = findOneByString(
  async (req: Request, res: Response, next: NextFunction, data) => {
    res.status(200).json({ success: true, data });
  },
  Archetypes,
  'name'
);

export const getAllArchetypes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = getOriginalUrl(req);
    const { name, cards, offset, limit }: IQueries = getValidProperties(
      ARCHETYPES_QUERIES_ARR,
      req.query
    );
    const limitNum = handleLimit(limit);
    const dbQueries = {};
    let filters = '';
    let total = 0;
    let data = [];
    let skip = 0;

    if (name) {
      dbQueries['name'] = formRegexObj(name.toUpperCase());
      filters += `&name=${name}`;
    }

    if (cards) {
      const aggregateArr: any = [
        {
          $unwind: '$source',
        },
        {
          $addFields: {
            source: {
              cardUrlListSize: { $size: '$source.cardUrlPathList' },
            },
            cardsSize: { $size: '$cards' },
          },
        },
      ];

      if (typeof cards === 'string') {
        filters += `&cards=${cards}`;
        dbQueries['cardsSize'] = defaultOperation(cards);
      }

      if (typeof cards === 'object' && Object.keys(cards).length) {
        const { key, num } = getFirstOperation(cards);
        filters += `&cards[${key}]=${num}`;
        dbQueries['cardsSize'] = formOperationObj(key, num);
      }

      aggregateArr.push({
        $match: {
          ...dbQueries,
        },
      });

      total = [...(await Archetypes.aggregate(aggregateArr))].length;
      skip = handleOffsetSkipCount(total, offset);
      data = await Archetypes.aggregate(aggregateArr)
        .skip(skip)
        .limit(limitNum);
    } else {
      total = await Archetypes.find(dbQueries).countDocuments();
      skip = handleOffsetSkipCount(total, offset);
      data = await Archetypes.find(dbQueries).skip(skip).limit(limitNum);
    }

    const pagination = formPagination({
      url,
      offset: skip,
      limit: limitNum,
      filters,
      total,
    });

    res.status(200).send({
      pagination,
      data,
    });
  }
);

export const updateArchetype = validateAndFindID(
  asyncHandler(
    async (
      { body, params }: Request,
      res: Response,
      next: NextFunction,
      result
    ) => {
      let updated = null;
      if (Object.keys(body).length) {
        const { name, source, coverImg } = getValidProperties(
          ARCHETYPE_UPDATABLE_PROPERTIES,
          body
        );

        const newDetails = {
          source: {
            ...result.source,
            ...source,
          },
          name: name || result.name,
          coverImg: coverImg || result.coverImg,
          slug: slugifyName(name || result.name),
        };

        await Archetypes.validate(newDetails);

        updated = await Archetypes.findByIdAndUpdate(params.id, newDetails, {
          new: true,
          includeResultMetadata: true,
        });
      }

      res.status(200).send({ success: true, data: updated?.value || result });
    }
  ),
  Archetypes
);

export const deleteArchetype = validateAndFindID(
  asyncHandler(
    async ({ params }: Request, res: Response, next: NextFunction) => {
      const result = await Archetypes.findByIdAndDelete({
        _id: params.id,
      });

      if (result?.cards.length) {
        for (const card of result.cards) {
          await Cards.findByIdAndUpdate(
            card._id,
            { archetype_id: null },
            { new: true, includeResultMetadata: true }
          );
        }
      }

      res.status(204).send(null);
    }
  ),
  Archetypes
);
