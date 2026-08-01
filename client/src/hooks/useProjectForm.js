import { useForm } from "react-hook-form";

const useProjectForm = () => {
  return useForm({
    defaultValues: {
      general: {
        projectName: "",
        builderName: "",
        projectType: "",
        slug: "",
        description: "",
      },

      /************************************************
       * portfolio  = Portfolio Tour
       * individual = Individual Project
       ************************************************/
      projectCategory: "individual",

      /**
       * Controls whether an Individual Project
       * belongs to a Portfolio Tour.
       */
      addToPortfolio: false,

      /**
       * Selected Portfolio Tour
       */
      parentProject: "",

      contact: {
        phone: "",
        whatsapp: "",
        email: "",
        website: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: "",
      },

      location: {
        address: "",
        city: "",
        state: "",
        pincode: "",
        googleMaps: "",
      },

      filters: {
        builder: "",
        city: "",
        area: "",
        propertyType: "",
        status: "",

        amenities: [],
        tags: [],
      },

      specifications: [],

      media: {
        coverImage: null,
        gallery: [],
      },

      /**
       * Google Drive / YouTube / Vimeo URLs
       */
      videos: [],

      /**
       * PDF Documents
       */
      brochures: [],

      /**
       * PDF Legal Documents
       */
      legalDocuments: [],

      floorPlans: [],

      seo: {
        metaTitle: "",
        metaDescription: "",
        shareDescription: "",
      },

      status: {
        status: "Draft",
        featured: false,
      },
    },
  });
};

export default useProjectForm;