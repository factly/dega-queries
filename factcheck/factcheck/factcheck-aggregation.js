db.factcheck.aggregate([
    // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  {
    $addFields: {
      claims: {
        $map: {
          input: {
            $map: {
              input: "$claims",
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
    $lookup: {
      from: "claim",
      let: { claims: "$claims" },
      pipeline: [
        { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$claims", []] }] } } },
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:1,
            claim: 1,
            slug: 1,
            clientId: "$client_id",
            title: 1,
            description: 1,
            claimDate: "$claim_date",
            claimSource: "$claim_source",
            checkedDate: "$checked_date",
            reviewSources: "$review_sources",
            review: "$review",
            reviewTagLine: "$review_tag_line",
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date",
            rating: { $arrayElemAt: [{ $objectToArray: "$rating" }, 1] },
            claimant: { $arrayElemAt: [{ $objectToArray: "$claimant" }, 1] }
          }
        },
        { $addFields: { rating: "$rating.v", claimant: "$claimant.v" } },
        {
          $lookup: {
            from: "rating",
            let: { media: "$rating" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$rating"] } } },
              {
                $project: {
                  id: '$_id',
                  _id: 0,
                  class:1,
                  name: 1,
                  numericValue: "$numeric_value",
                  isDefault: "$is_default",
                  slug: 1,
                  clientId: "$client_id",
                  description: 1,
                  media: 1,
                  createdDate: "$created_date",
                  lastUpdatedDate: "$last_updated_date"
                }
              }
            ],
            as: "rating"
          },
          $lookup: {
            from: "claimant",
            let: { media: "$claimant" },
            pipeline: [
              { $match: { $expr: { $eq: ["$_id", "$$claimant"] } } },
              {
                $project: {
                  id: '$_id',
                  _id: 0,
                  class:1,
                  name: 1,
                  numericValue: "$numeric_value",
                  isDefault: "$is_default",
                  slug: 1,
                  clientId: "$client_id",
                  description: 1,
                  media: 1,
                  createdDate: "$created_date",
                  lastUpdatedDate: "$last_updated_date"
                }
              }
            ],
            as: "claimant"
          }
        },
        { $unwind: { path: "$claimant", preserveNullAndEmptyArrays: true } }
      ],
      as: "claims"
    }
  },
  {
    $project: {
      id: '$_id',
      _id: 0,
      class:1,
      title: 1,
      clientId: "$client_id",
      content: 1,
      excerpt: 1,
      introduction: 1,
      summary: 1,
      publishedDate: "$published_date",
      featured: 1,
      sticky: 1,
      updates: 1,
      slug: 1,
      subTitle: "$sub_title",
      createdDate: "$created_date",
      lastUpdatedDate: "$last_updated_date",
      claims: 1,
      tags: 1,
      categories: 1,
      status: 1,
      format: 1,
      degaUsers: 1,
      media: 1
    }
  }
]);
