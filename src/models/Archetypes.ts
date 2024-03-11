import { Document, Model, Types, Schema, model } from 'mongoose';
import slugifyName from '../lib/slugify';

interface IArchSchema extends Document {
  name: string;
  coverImg: string;
  slug: string;
  source: {
    domain: string;
    archetypeUrl: string;
    cardUrlPathList: [string];
  };
  cards: [Types.ObjectId];
}

interface IArchSchemaMethods extends Model<IArchSchema> {
  getCards(name: string, Card: object): [any];
  updateCardList(name: string, Card: object): void;
}

const ArchetypesSchema = new Schema<IArchSchema, IArchSchemaMethods>({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 1,
    maxlength: 42,
    uppercase: true,
  },
  coverImg: { type: String, default: '' },
  slug: String,
  source: {
    domain: {
      type: String,
      required: [
        true,
        'Please include the original domain website where this data came from.',
      ],
      match: [
        /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    archetypeUrl: {
      type: String,
      required: [
        true,
        'Please indicate the original url path of this archetype.',
      ],
    },
    cardUrlPathList: [String],
  },
  cards: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Cards',
    },
  ],
});

ArchetypesSchema.statics.getCards = async function (archetypeName, Card) {
  const cardsResult = await Card.find({
    archetype: `${archetypeName}`,
  }).collation({ locale: 'en_US', strength: 1 });
  /*Note: collation strength 1
  to ignoring other differences such as diacritics and case.*/

  return cardsResult;
};

ArchetypesSchema.statics.updateCardList = async function (archetype, Card) {
  const cardResults = await Card.find({
    archetype: `${archetype.name}`,
  }).collation({ locale: 'en_US', strength: 1 });

  if (cardResults) {
    for (const card of cardResults) {
      await Card.findByIdAndUpdate(
        card._id,
        { archetype_id: archetype._id },
        { new: true, includeResultMetadata: true }
      );
    }
  }
};

ArchetypesSchema.pre('save', async function (next) {
  const Card = await model('Cards');
  const { getCards } = this.constructor as IArchSchemaMethods;
  this.slug = slugifyName(this.name);
  this.cards = await getCards(this.name, Card);

  next();
});

ArchetypesSchema.pre('insertMany', async function (next, docs) {
  const Card = await model('Cards');
  const { getCards } = await model<IArchSchema, IArchSchemaMethods>(
    'Archetypes'
  );

  for (const archetype of docs) {
    const { name } = archetype;

    if (name) {
      archetype.slug = slugifyName(name);
      archetype.cards = await getCards(name, Card);
    }
  }

  next();
});

ArchetypesSchema.post('save', async function (docs: any, next) {
  const Card = await model('Cards');
  const { updateCardList } = this.constructor as IArchSchemaMethods;
  await updateCardList(docs, Card);
});

ArchetypesSchema.post('insertMany', async function (docs: any, next) {
  const Card = await model('Cards');
  const { updateCardList } = await model<IArchSchema, IArchSchemaMethods>(
    'Archetypes'
  );

  for (const archetype of docs) {
    await updateCardList(archetype, Card);
  }
});

export default model('Archetypes', ArchetypesSchema);
