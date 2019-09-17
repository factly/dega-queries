db.claimant.aggregate([

  // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  // {
  //   $addFields: {
  //     media: { $arrayElemAt: [{ $objectToArray: "$media" }, 1] }
  //   }
  // },
  // {
  //   $addFields: {
  //     media: "$media.v"
  //   }
  // },
  // {
  //   $lookup: {
  //     from: "media",
  //     let: { media: "$media" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
  //     pipeline: [
  //       { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
  //       {
  //         $project: {
  //           _id: 1,
  //           _class:1,
  //           name: 1,
  //           type: 1,
  //           url: 1,
  //           fileSize: "$file_size",
  //           dimensions: 1,
  //           title: 1,
  //           caption: 1,
  //           altText: "$alt_text",
  //           description: 1,
  //           uploadedBy: "$uploaded_by",
  //           publishedDate: "$published_date",
  //           lastUpdatedDate: "$last_updated_date",
  //           slug: 1,
  //           clientId: "$client_id",
  //           createdDate: "$created_date",
  //           relativeURL: "$relative_url",
  //           sourceURL: "$source_url"
  //         }
  //       }
  //     ],
  //     as: "media"
  //   }
  // },
  // { $unwind: { path: "$media", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      _class:1,
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
]);
