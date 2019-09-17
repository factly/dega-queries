db.dega_user.aggregate([
    // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  {
    $addFields: {
      media: { $arrayElemAt: [{ $objectToArray: "$media" }, 1] },
      roleMappings: {
        $map: {
          input: {
            $map: {
              input: "$roleMappings",
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
    $addFields: {
      media: "$media.v"
    }
  },
  {
    $lookup: {
      from: "media",
      let: { media: "$media" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            _id: 1,
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
  { $unwind: { path: "$media", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "role_mapping",
      let: { roleMappings: "$roleMappings" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$roleMappings", []] }] } } }
        ,
        {
          $project: {
            _id: 1,
            name: 1
          }
        }
      ],
      as: "roleMappings"
    }
  },
  {
    $project: {
      _id: 1,
      firstName: "$first_name",
      lastName: "$last_name",
      displayName: "$display_name",
      website: 1,
      facebookURL: "$facebook_url",
      twitterURL: "$twitter_url",
      instagramURL: "$instagram_url",
      linkedinURL: "$linkedin_url",
      githubURL: "$github_url",
      profilePicture: "$profile_picture",
      description: 1,
      slug: 1,
      email: 1,
      createdDate: "$created_date",
      media: 1,
      roleMappings: 1
    }
  }
]);
