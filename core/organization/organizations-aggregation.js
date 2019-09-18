db.organization.aggregate([

  // Instead of projecting the entire collection out, lets just mutate the results with the fields we need changed
  {
    $addFields: {
      mediaLogo: { $arrayElemAt: [{ $objectToArray: "$mediaLogo" }, 1] },
      mediaMobileLogo: { $arrayElemAt: [{ $objectToArray: "$mediaMobileLogo" }, 1] },
      mediaFavicon: { $arrayElemAt: [{ $objectToArray: "$mediaFavicon" }, 1] },
      mediaMobileIcon: { $arrayElemAt: [{ $objectToArray: "$mediaMobileIcon" }, 1] }
    }
  },
  {
    $addFields: {
      mediaLogo: "$mediaLogo.v",
      mediaMobileLogo: "$mediaMobileLogo.v",
      mediaFavicon: "$mediaFavicon.v",
      mediaMobileIcon: "$mediaMobileIcon.v"
    }
  },
  {
    $lookup: {
      from: "media",
      let: { media: "$mediaLogo" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:1,
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
      as: "mediaLogo"
    }
  },
  { $unwind: { path: "$mediaLogo", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "media",
      let: { media: "$mediaMobileLogo" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:1,
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
      as: "mediaMobileLogo"
    }
  },
  { $unwind: { path: "$mediaMobileLogo", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "media",
      let: { media: "$mediaFavicon" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:1,
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
      as: "mediaFavicon"
    }
  },
  { $unwind: { path: "$mediaFavicon", preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: "media",
      let: { media: "$mediaMobileIcon" }, // this option provides the value from the outside data into the lookup's pipline. This variable is referenced in the inner pipline with $$
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$media"] } } }, // in order to access the variable provided in the let, we need to use a $expr, it will not pass the variable through otherwise
        {
          $project: {
            id: '$_id',
            _id: 0,
            class:1,
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
      as: "mediaMobileIcon"
    }
  },
  { $unwind: { path: "$mediaMobileIcon", preserveNullAndEmptyArrays: true } },
  {
    $project: {
      id: '$_id',
      _id: 0,
      class:1,
      name: 1,
      phone: 1,
      siteTitle: "$sub_title",
      tagLine: "$tag_line",
      description: 1,
      baiduVerificationCode: "$baidu_verification_code",
      bingVerificationCode: "$bing_verification_code",
      googleVerificationCode: "$google_verification_code",
      yandexVerificationCode: "$yandex_verification_code",
      facebookURL: "$facebook_url",
      twitterURL: "$twitter_url",
      instagramURL: "$instagram_url",
      linkedInURL: "$linked_in_url",
      pinterestURL: "$pinterest_url",
      youTubeURL: "$youTube_url",
      googlePlusURL: "$google_plus_url",
      githubURL: "$github_url",
      facebookPageAccessToken: "$facebook_page_access_token",
      gaTrackingCode: "$ga_tracking_code",
      siteLanguage: "$site_language",
      timeZone: "$time_zone",
      clientId: "$client_id",
      slug: 1,
      email: 1,
      createdDate: "$created_date",
      lastUpdatedDate: "$last_updated_date",
      siteAddress: "$site_address",
      mediaLogo: 1,
      mediaMobileLogo: 1,
      mediaFavicon: 1,
      mediaMobileIcon: 1
    }
  }
]);
