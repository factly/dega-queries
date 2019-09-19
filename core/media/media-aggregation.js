db.media.aggregate([
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
]);
