import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import Cards from '../models/Cards';
import Archetypes from '../models/Archetypes';
import asyncHandler from '../custom-middleware/async';
import {
  validateAndFindID,
  validateArrData,
} from '../custom-middleware/validations';
import { findOneByString } from '../custom-middleware/find';
import slugifyName from '../lib/slugify';
import { CARD_UPDATABLE_PROPERTIES } from '../data/constant_variables';
import { getOriginalUrl } from '../utilities/texts';
import { handleLimit } from '../utilities/db-util';
import { handleOffsetSkipCount } from '../utilities/numbers';
import {
  getValidProperties,
  formPagination,
  formRegexObj,
  defaultOperation,
  getFirstOperation,
  formOperationObj,
} from '../utilities/object-format';
import { CARDS_QUERIES_ARR } from '../data/constant_variables';

export const addCards = validateArrData(
  asyncHandler(async ({ body }: Request, res: Response, next: NextFunction) => {
    const result = Array.isArray(body)
      ? await Cards.insertMany(body, { ordered: false })
      : await Cards.create(body);

    res.status(201).json({
      success: true,
      data: {
        card: result,
      },
    });
  }),
  Cards
);

export const getCardByID = validateAndFindID(
  async (req: Request, res: Response, next: NextFunction, data) => {
    res.status(200).json({ success: true, data });
  },
  Cards
);

export const getCardByName = findOneByString(
  async (req: Request, res: Response, next: NextFunction, data) => {
    res.status(200).json({ success: true, data });
  },
  Cards,
  'cardName'
);

export const getAllCards = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const url = getOriginalUrl(req);
    const {
      offset,
      limit,
      name,
      archetype,
      attribute,
      type,
      typing,
      cardtext,
      pendulumtext,
      levelorrank,
      link,
      atk,
      def,
    } = getValidProperties(CARDS_QUERIES_ARR, req.query);
    const limitNum = handleLimit(limit);
    const dbQueries = {};
    let filters = '';
    let total = 0;
    let skip = 0;

    if (name) {
      dbQueries['cardName'] = formRegexObj(name.toUpperCase());
      filters += `&name=${name}`;
    }

    if (archetype) {
      dbQueries['archetype'] = formRegexObj(archetype);
      filters += `&archetype=${archetype}`;
    }

    if (attribute) {
      dbQueries['attribute'] = formRegexObj(attribute.toUpperCase());
      filters += `&attribute=${attribute}`;
    }

    if (type) {
      dbQueries['type'] = formRegexObj(type);
      filters += `&type=${type}`;
    }

    if (typing) {
      dbQueries['typing'] = formRegexObj(typing);
      filters += `&typing=${typing}`;
    }

    if (cardtext) {
      dbQueries['cardText'] = formRegexObj(cardtext);
      filters += `&cardtext=${cardtext}`;
    }

    if (pendulumtext) {
      dbQueries['pendulumText'] = formRegexObj(pendulumtext);
      filters += `&pendulumtext=${pendulumtext}`;
    }

    if (levelorrank) {
      if (typeof levelorrank === 'string') {
        filters += `&levelorrank=${levelorrank}`;
        dbQueries['levelOrRank'] = defaultOperation(levelorrank);
      }

      if (typeof levelorrank === 'object') {
        const { key, num } = getFirstOperation(levelorrank);
        filters += `&levelorrank[${key}]=${num}`;
        dbQueries['levelOrRank'] = formOperationObj(key, num);
      }
    }

    if (link) {
      if (typeof link === 'string') {
        filters += `&link=${link}`;
        dbQueries['link'] = defaultOperation(link);
      }

      if (typeof link === 'object') {
        const { key, num } = getFirstOperation(link);
        filters += `&link[${key}]=${num}`;
        dbQueries['link'] = formOperationObj(key, num);
      }
    }

    if (atk) {
      if (typeof atk === 'string') {
        filters += `&atk=${atk}`;
        dbQueries['attack'] = defaultOperation(atk);
      }

      if (typeof atk === 'object') {
        const { key, num } = getFirstOperation(atk);
        filters += `&atk[${key}]=${num}`;
        dbQueries['attack'] = formOperationObj(key, num);
      }
    }

    if (def) {
      if (typeof def === 'string') {
        filters += `&def=${def}`;
        dbQueries['defense'] = defaultOperation(def);
      }

      if (typeof def === 'object') {
        const { key, num } = getFirstOperation(def);
        filters += `&def[${key}]=${num}`;
        dbQueries['defense'] = formOperationObj(key, num);
      }
    }

    total = await Cards.find(dbQueries).countDocuments();
    skip = handleOffsetSkipCount(total, offset);
    const data = await Cards.find(dbQueries).skip(skip).limit(limitNum);

    const pagination = formPagination({
      url,
      offset: skip,
      limit: limitNum,
      filters: filters.toLocaleLowerCase(),
      total,
    });

    res.status(200).send({ pagination, data });
  }
);

export const updateCard = validateAndFindID(
  asyncHandler(
    async (
      { body, params }: Request,
      res: Response,
      next: NextFunction,
      result
    ) => {
      let updated = null;
      const paramID = new ObjectId(params.id);
      const options = {
        new: true,
        includeResultMetadata: true,
      };
      if (Object.keys(body).length) {
        const {
          cardName,
          images,
          cardText,
          pendulumText,
          references,
          dateReleased,
          type,
          typing,
          archetype,
          attribute,
          levelOrRank,
          attack,
          defense,
        } = getValidProperties(CARD_UPDATABLE_PROPERTIES, body);

        const newDetails = {
          cardName: cardName || result.cardName,
          images: {
            ...result.images,
            ...images,
          },
          cardText: cardText || result.cardText,
          pendulumText,
          references: {
            ...result.references,
            ...references,
          },
          dateReleased: {
            ...result.dateReleased,
            ...dateReleased,
          },
          archetype_id: result?.archetype_id,
          type: type || result.type,
          typing: typing || result.typing,
          archetype: archetype || result.archetype,
          attribute: attribute || result.attribute,
          levelOrRank: levelOrRank || result.levelOrRank,
          attack: attack || result.attack,
          defense: defense || result.defense,
          slug: slugifyName(cardName || result.cardName),
        };

        await Cards.validate(newDetails); //validate details

        if (
          result?.archetype.toUpperCase() !== body?.archetype.toUpperCase() &&
          result?.archetype_id
        ) {
          const oldArchetype = await Archetypes.findById({
            _id: result.archetype_id,
          });

          if (oldArchetype) {
            const updatedCards = oldArchetype.cards.filter((cardId) => {
              if (cardId && !cardId.equals(paramID)) {
                return cardId;
              }
            });
            await Archetypes.findByIdAndUpdate(
              {
                _id: result.archetype_id,
              },
              {
                cards: updatedCards,
              },
              options
            );
          }
        }

        const newArchetype = await Archetypes.findOne({
          name: newDetails?.archetype.toUpperCase(),
        });

        if (newArchetype) {
          const cards = newArchetype?.cards;
          newDetails.archetype_id = newArchetype._id;
          cards.push(paramID);
          await Archetypes.findByIdAndUpdate(
            {
              _id: newArchetype._id,
            },
            {
              cards: cards,
            },
            options
          );
        } else {
          newDetails.archetype_id = null;
        }

        updated = await Cards.findByIdAndUpdate(params.id, newDetails, options);
      }

      res.status(200).send({ success: true, data: updated?.value || result });
    }
  ),
  Cards
);

export const deleteCard = validateAndFindID(
  asyncHandler(
    async ({ params }: Request, res: Response, next: NextFunction) => {
      const result = await Cards.findByIdAndDelete({
        _id: params.id,
      });

      const archetype = await Archetypes.findById({
        _id: result?.archetype_id,
      });

      if (archetype?.cards.length) {
        const idToRemove = new ObjectId(params.id);
        const newCardList = archetype?.cards.filter((cardId: any) => {
          if (!cardId.equals(idToRemove)) {
            return cardId;
          }
        });

        await Archetypes.findByIdAndUpdate(
          archetype._id,
          { cards: newCardList },
          { new: true, includeResultMetadata: true }
        );
      }

      res.status(204).send(null);
    }
  ),
  Cards
);
