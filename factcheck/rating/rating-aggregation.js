db.rating.aggregate([
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
]);
