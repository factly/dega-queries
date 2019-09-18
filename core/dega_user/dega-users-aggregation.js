db.getCollection("dega_user").aggregate(

	// Pipeline
	[
		// Stage 1
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

		// Stage 2
		{
			$addFields: {
			  media: "$media.v"
			}
		},

		// Stage 3
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

		// Stage 4
		{
			$unwind: { path: "$media", preserveNullAndEmptyArrays: true }
		},

		// Stage 5
		{
			$lookup: {
			  from: "role_mapping",
			  let: { roleMappings: "$roleMappings" },
			  pipeline: [
			    { $match: { $expr: { $in: ["$_id", { $ifNull: ["$$roleMappings", []] }] } } }
			    ,
			    {
			      $project: {
			        id: '$_id',
					_id: 0,
					class:'$_class',
			        name: 1
			      }
			    }
			  ],
			  as: "roleMappings"
			}
		},

		// Stage 6
		{
			$project: {
				id: '$_id',
				_id: 0,
				class:'$_class',
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
		},

	]


);
