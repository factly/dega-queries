db.claim.aggregate([

  // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  {
    $addFields: {
      rating: { $arrayElemAt: [{ $objectToArray: "$rating" }, 1] },
      claimant: { $arrayElemAt: [{ $objectToArray: "$claimant" }, 1] }
    }
  },
  {
    $addFields: {
      rating: "$rating.v", claimant: "$claimant.v"
    }
  },
  {
    $lookup: {
      from: "rating",
      let: { rating: "$rating" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$rating"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            _id: 1,
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
    }
  },
  { $unwind: { path: "$claimant", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "claimant",
      let: { claimant: "$claimant" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$claimant"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            _id: 1,
            name: 1,
            tagLine: "$tag_line",
            slug: 1,
            clientId: "$client_id",
            description: 1,
            createdDate: "$created_date",
            lastUpdatedDate: "$last_updated_date"
          }
        }
      ],
      as: "claimant"
    }
  },
  { $unwind: { path: "$claimant", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      claim: 1,
      slug: 1,
      clientId: "$client_id",
      title: 1,
      description: 1,
      rating: 1,
      claimant: 1,
      claimDate: "$claim_date",
      claimSource: "$claim_source",
      checkedDate: "$checked_date",
      reviewSources: "$review_sources",
      review: "$review",
      reviewTagLine: "$review_tag_line",
      createdDate: "$created_date",
      lastUpdatedDate: "$last_updated_date"
    }
  }
]);
