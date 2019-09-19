db.post.aggregate([
    // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  {
    $addFields: {
      status: { $arrayElemAt: [{ $objectToArray: "$status" }, 1] },
      format: { $arrayElemAt: [{ $objectToArray: "$format" }, 1] },
      media: { $arrayElemAt: [{ $objectToArray: "$media" }, 1] },
      tags: {
        $map: {
          input: {
            $map: {
              input: "$tags",
              in: {
                $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
              }
            }
          },
          in: "$$this.v"
        }
      },
      categories: {
        $map: {
          input: {
            $map: {
              input: "$categories",
              in: {
                $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
              }
            }
          },
          in: "$$this.v"
        }
      },
      degaUsers: {
        $map: {
          input: {
            $map: {
              input: "$degaUsers",
              in: {
                $arrayElemAt: [{ $objectToArray: "$$this" }, 1]
              }
            }
          },
          in: "$$this.v"
        }
      }
    }
  },
  {
    $addFields: { status: "$status.v", format: "$format.v", media: "$media.v" }
  },
  {
    $lookup: {
      from: "status",
      let: { status: "$status"},
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$status"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            name: 1,
            slug: 1,
            clientId: "$client_id",
            isDefault: "$is_default",
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date"
          }
        }
      ],
      as: "status"
    }
  },
  { $unwind: "$status" },
  {
    $lookup: {
      from: "format",
      let: { format: "$format"},
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$format"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            name: 1,
            slug: 1,
            clientId: "$client_id",
            isDefault: "$is_default",
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date"
          }
        }
      ],
      as: "format"
    }
  },
  { $unwind: "$format" },
//   Another type of lookup where we provide it it's own aggregate pipline to mutate and filter the returned results
  {
    $lookup: {
      from: "media",
      let: { media: "$media" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            name: 1,
            type: 1,
            url: 1,
            fileSize: "$file_size",
            dimensions: 1,
            title: 1,
            caption: 1,
            altText: "$alt_text",
            description: 1,
            uploadedBy: "$uploaded_by",
            publishedDate: "$published_date",
            lastUpdatedDate: "$last_updated_date",
            slug: 1,
            clientId: "$client_id",
            createdDate: "$created_date",
            relativeURL: "$relative_url",
            sourceURL: "$source_url"
          }
        }
      ],
      as: "media"
    }
  },
  { $unwind: { path: "$media", preserveNullAndEmptyArrays: true } }, // Media is nullable, let's not filter out records that don't have the media option
  {
    $lookup: {
      from: "tag",
      let: { tags: "$tags" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$tags", []] }] } } },
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            name: 1,
            slug: 1,
            description: 1,
            clientId: "$client_id",
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date"
          }
        }
      ],
      as: "tags"
    }
  },
  {
    $lookup: {
      from: "category",
      let: { categories: "$categories" },
      pipeline: [
        {
          $match: {
            $expr: { $in: ["$_id", { $ifNull: ["$$categories", []] }] }
          }
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            name: 1,
            description: 1,
            slug: 1,
            parent: 1,
            clientId: "$client_id",
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date"
          }
        }
      ],
      as: "categories"
    }
  },
  {
    $lookup: {
      from: "dega_user",
      let: { degaUsers: "$degaUsers" },
      pipeline: [
        {
          $match: { $expr: { $in: ["$_id", { $ifNull: ["$$degaUsers", []] }] } }
        },
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:'$_class',
            firstName: "$first_name",
            lastName: "$last_name",
            displayName: "$display_Name",
            website: 1,
            facebookURL: { $ifNull: ["$facebookURL", null] }, // These fields don't exist on the record's, let's make sure they are projected into the result even so. This can be replaced with the proper values when they are available
            twitterURL: { $ifNull: ["$twitterURL", null] },
            instagramURL: { $ifNull: ["$instagramURL", null] },
            linkedinURL: { $ifNull: ["$linkedinURL", null] },
            githubURL: { $ifNull: ["$githubURL", null] },
            profilePicture: { $ifNull: ["$profile_picture", null] },
            description: 1,
            slug: 1,
            enabled: 1,
            emailVerified: "$email_verified",
            email: 1,
            createdDate: "$created_date",
            media: { $arrayElemAt: [{ $objectToArray: "$media" }, 1] }
          }
        },
        { $addFields: { media: "$media.v" } },
        {
          $lookup: {
            from: "media",
            let: { media: "$media" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$media"] } } },
              {
                $project: {
                  id: '$_id',
                  _id: 0,
                  class:'$_class',
                  name: 1,
                  type: 1,
                  url: 1,
                  fileSize: "$file_size",
                  dimensions: 1,
                  title: 1,
                  caption: 1,
                  altText: "$alt_text",
                  description: 1,
                  uploadedBy: "$uploaded_by",
                  publishedDate: "$published_date",
                  lastUpdatedDate: "$last_updated_date",
                  slug: 1,
                  clientId: "$client_id",
                  createdDate: "$created_date",
                  relativeURL: "$relative_url",
                  sourceURL: "$source_url"
                }
              }
            ],
            as: "media"
          }
        },
        { $unwind: { path: "$media", preserveNullAndEmptyArrays: true } }
      ],
      as: "users"
    }
  },
  {
    $project: {
      id: "$_id",
      _id : 0,
      class: "$_class",
      title: 1,
      clientId: "$client_id",
      content: 1,
      excerpt: 1,
      publishedDate: "$published_date",
      lastUpdatedDate: "$last_updated_date",
      featured: 1,
      sticky: 1,
      updates: 1,
      slug: 1,
      subTitle: "$sub_title",
      createdDate: "$created_date",
      tags: 1,
      categories: 1,
      status: 1,
      format: 1,
      users: 1,
      media: 1
    }
  }
]);
