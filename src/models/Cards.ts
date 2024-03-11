import { Document, Model, Types, Schema, model } from 'mongoose';
import slugifyName from '../lib/slugify';

interface ICardsSchema extends Document {
  cardName: string;
  images: {
    imgFileName: string;
    imgCropFileName: string;
  };
  cardText: string;
  pendulumText: string;
  references: {
    originalSources: {
      img: string;
      imgCrop: string;
      dataSource: string;
    };
    tcgPlayer: string;
    cardMarket: string;
  };
  dateReleased: {
    tcgDate: string;
    ocgDate: string;
  };
  type: string;
  typing: string;
  archetype_id: Types.ObjectId | null;
  archetype: string;
  attribute: string;
  levelOrRank: number;
  link: number;
  attack: number;
  defense: number;
  slug: string;
}

interface ICardsSchemaMethods extends Model<ICardsSchema> {
  updateArchetype(card: object, Archetypes: object): void;
  addDefaultAtkDef(card: object): void;
  addArchetypeID(card: object, Archetypes: object): void;
}

const CardsSchema = new Schema<ICardsSchema, ICardsSchemaMethods>({
  cardName: {
    type: String,
    required: [true, 'Please add a card name'],
    unique: true,
    maxlength: 55,
    uppercase: true,
  },
  images: {
    imgFileName: {
      type: String,
      required: [true, 'Please indicate the card image filename'],
    },
    imgCropFileName: {
      type: String,
      required: [true, 'Please indicate the cropped card image filename'],
    },
  },
  cardText: { type: String, required: true, maxlength: 1000 },
  pendulumText: { type: String, maxlength: 1000 },
  references: {
    originalSources: {
      img: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS',
        ],
      },
      imgCrop: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS',
        ],
      },
      dataSource: {
        type: String,
        match: [
          /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
          'Please use a valid URL with HTTP or HTTPS',
        ],
        required: [
          true,
          'Please include the originial url source of this card info',
        ],
      },
    },
    tcgPlayer: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
    cardMarket: {
      type: String,
      match: [
        /https?:\/\/(www\.)?[a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-z-A-Z0-9()@:%_\+.~#?&//=]*)/,
        'Please use a valid URL with HTTP or HTTPS',
      ],
    },
  },
  dateReleased: {
    tcgDate: String,
    ocgDate: String,
  },
  type: {
    type: String,
    required: [
      true,
      'Please indicate the type of this card (Trap, Spell, Monster Effect, Normal Trapcard, etc...)',
    ],
    enum: [
      'Effect Monster',
      'Flip Effect Monster',
      'Fusion Monster',
      'Gemini Monster',
      'Link Monster',
      'Normal Monster',
      'Normal Tuner Monster',
      'Pendulum Effect Fusion Monster',
      'Pendulum Effect Monster',
      'Pendulum Effect Ritual Monster',
      'Pendulum Flip Effect Monster',
      'Pendulum Normal Monster',
      'Pendulum Tuner Effect Monster',
      'Ritual Effect Monster',
      'Ritual Monster',
      'Skill Card',
      'Spell Card',
      'Spirit Monster',
      'Synchro Monster',
      'Synchro Pendulum Effect Monster',
      'Synchro Tuner Monster',
      'Token',
      'Toon Monster',
      'Trap Card',
      'Tuner Monster',
      'Union Effect Monster',
      'XYZ Monster',
      'XYZ Pendulum Effect Monster',
    ],
  },
  typing: {
    type: String,
    required: [
      true,
      'Please indicate the typing of this card (if its machine, warrior, spellcaster, etc...)',
    ],
    enum: [
      'Aqua',
      'Beast',
      'Beast-Warrior',
      'Continuous',
      'Counter',
      'Creator-God',
      'Cyberse',
      'Dinosaur',
      'Divine-Beast',
      'Dragon',
      'Equip',
      'Fairy',
      'Field',
      'Fiend',
      'Fish',
      'Illusion',
      'Insect',
      'Machine',
      'Normal',
      'Plant',
      'Psychic',
      'Pyro',
      'Quick-Play',
      'Reptile',
      'Ritual',
      'Rock',
      'Sea Serpent',
      'Spellcaster',
      'Thunder',
      'Warrior',
      'Winged Beast',
      'Wyrm',
      'Zombie',
    ],
  },
  archetype_id: {
    type: Schema.Types.ObjectId,
    ref: 'Archetypes',
    default: null,
  },
  archetype: { type: String, default: null },
  attribute: {
    type: String,
    enum: ['DARK', 'DIVINE', 'EARTH', 'FIRE', 'LIGHT', 'WATER', 'WIND'],
  },
  levelOrRank: Number,
  link: Number,
  attack: Number,
  defense: Number,
  slug: String,
});

CardsSchema.statics.updateArchetype = async function (card, Archetypes) {
  const archetypeResult = await Archetypes.findOne({
    name: `${card?.archetype}`,
  });

  if (archetypeResult) {
    await Archetypes.findByIdAndUpdate(
      archetypeResult._id,
      {
        cards: [...archetypeResult.cards, card],
      },
      { new: true, includeResultMetadata: true }
    );
  }
};

CardsSchema.statics.addDefaultAtkDef = function (card) {
  //Handle objects where atk has value but no def and add 0 so both property will exist.
  if (card.attack && !card.defense) {
    card.defense = 0;
  } else if (!card.attack && card.defense) {
    card.attack = 0;
  }
};

CardsSchema.statics.addArchetypeID = async function (card, Archetypes) {
  const archetypeResult = await Archetypes.findOne({
    name: `${card?.archetype?.toUpperCase()}`,
  });

  if (archetypeResult) {
    card.archetype_id = archetypeResult._id;
  }
};

CardsSchema.pre('save', async function (next) {
  const Archetypes = await model('Archetypes');
  const { addDefaultAtkDef, addArchetypeID } = this
    .constructor as ICardsSchemaMethods;

  addDefaultAtkDef(this);
  await addArchetypeID(this, Archetypes);

  this.slug = slugifyName(this.cardName);

  next();
});

CardsSchema.pre('insertMany', async function (next, docs) {
  const { addDefaultAtkDef, addArchetypeID } = await model<
    ICardsSchema,
    ICardsSchemaMethods
  >('Cards');
  const Archetypes = await model('Archetypes');

  for (const card of docs) {
    await addDefaultAtkDef(card);
    await addArchetypeID(card, Archetypes);
    card.slug = slugifyName(card.cardName);
  }

  next();
});

CardsSchema.post('save', async function (docs, next) {
  const Archetypes = await model('Archetypes');
  const { updateArchetype } = this.constructor as ICardsSchemaMethods;
  await updateArchetype(docs, Archetypes);
});

CardsSchema.post('insertMany', async function (docs: any, next) {
  const Archetypes = await model('Archetypes');
  /*Run the static; Note: this points to array of docs in insertMany.
  So this.constructor is not accessible for accessing static method(s).*/
  const { updateArchetype } = await model<ICardsSchema, ICardsSchemaMethods>(
    'Cards'
  );

  for (const card of docs) {
    await updateArchetype(card, Archetypes);
  }
});

export default model('Cards', CardsSchema);
