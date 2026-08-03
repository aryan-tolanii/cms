import mongoose from "mongoose";

const { Schema, model } = mongoose;

/**
 * ==========================================
 * Reusable Embedded Sub-Schemas
 * ==========================================
 * These are shared shapes used inside arrays on the Project document.
 * `_id: false` keeps embedded array items lean, since they don't need
 * to be queried/referenced independently outside their parent document.
 */

const galleryItemSchema = new Schema(
  {
    url: {
      type: String,
      trim: true,
    },
    alt: {
      type: String,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const galleryAlbumSchema = new Schema(
  {
    albumName: {
      type: String,
      required: true,
      trim: true,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    images: {
      type: [galleryItemSchema],
      default: [],
    },
  },
  { _id: false },
);

const videoItemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: false },
);

const floorPlanPageSchema = new Schema(
  {
    pageNumber: {
      type: Number,
      required: true,
    },
    dziPath: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const floorPlanItemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },

    originalPdf: {
      type: String,
      trim: true,
      required: true,
    },

    thumbnail: {
      type: String,
      trim: true,
    },

    pages: {
      type: [floorPlanPageSchema],
      default: [],
    },

    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  { _id: true },
);

const documentItemSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

/**
 * ==========================================
 * Top-Level Grouped Sub-Schemas
 * ==========================================
 * Each of these maps to a nested object on the Project document,
 * grouping related fields instead of flattening everything to the root.
 */

const generalSchema = new Schema(
  {
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    builderName: {
      type: String,
      required: [true, "Builder name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    projectType: {
      type: String,
    },
    tagline: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const contactSchema = new Schema(
  {
    phone: {
      type: String,
      trim: true,
    },

    whatsapp: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    website: {
      type: String,
      trim: true,
    },

    facebook: {
      type: String,
      trim: true,
    },

    instagram: {
      type: String,
      trim: true,
    },

    linkedin: {
      type: String,
      trim: true,
    },

    youtube: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const locationSchema = new Schema(
  {
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    pincode: {
      type: String,
      trim: true,
    },
    googleMaps: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const specificationItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const specificationSectionSchema = new Schema(
  {
    primaryTitle: {
      type: String,
      trim: true,
      default: "",
    },

    items: {
      type: [specificationItemSchema],
      default: [],
    },
  },
  { _id: false },
);

const filtersSchema = new Schema(
  {
    city: {
      type: String,
      trim: true,
    },

    area: {
      type: String,
      trim: true,
    },

    propertyType: {
      type: String,
      trim: true,
    },

    amenities: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  { _id: false },
);

const mediaSchema = new Schema(
  {
    coverImage: {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    thumbnailImage: {
      url: {
        type: String,
        trim: true,
      },
      alt: {
        type: String,
        trim: true,
      },
    },
    gallery: {
      type: [galleryAlbumSchema],
      default: [],
    },
  },
  { _id: false },
);

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
    },

    metaDescription: {
      type: String,
      trim: true,
    },

    shareDescription: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const statusSchema = new Schema(
  {
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Draft",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

/**
 * ==========================================
 * Project Schema
 * ==========================================
 */
const projectSchema = new Schema(
  {
    general: {
      type: generalSchema,
      required: true,
    },

    projectTag: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
      index: true,
    },

    /**
     * portfolio  = Portfolio Tour
     * individual = Individual Project
     */
    projectCategory: {
      type: String,
      enum: ["portfolio", "individual"],
      default: "individual",
      required: true,
    },

    /**
     * parentProject is only used by Individual Projects.
     * Portfolio Tours always have parentProject = null.
     */
    parentProject: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },

    contact: {
      type: contactSchema,
      default: () => ({}),
    },

    location: {
      type: locationSchema,
      default: () => ({}),
    },

    specifications: {
      type: [specificationSectionSchema],
      default: [],
    },

    filters: {
      type: filtersSchema,
      default: () => ({}),
    },

    media: {
      type: mediaSchema,
      default: () => ({}),
    },

    videos: {
      type: [videoItemSchema],
      default: [],
    },

    brochures: {
      type: [documentItemSchema],
      default: [],
    },

    legalDocuments: {
      type: [documentItemSchema],
      default: [],
    },

    floorPlans: {
      type: [floorPlanItemSchema],
      default: [],
    },

    seo: {
      type: seoSchema,
      default: () => ({}),
    },

    status: {
      type: statusSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.models.Project || model("Project", projectSchema);

export default Project;
