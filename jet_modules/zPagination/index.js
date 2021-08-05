module.exports = {
    pagination: {
        pageNumber: 1,
        pageSize: 10,
        totalNumber: 0,
        pageRange: 4
    }, setPagenation: function (params) {
        if( params.pagination === undefined ){
            // params.pagination = this.pagination; // error coding - all user get same page~~!
            params.pagination = Object.create(this.pagination);
        }
        if(params.pageNumber !== undefined) params.pagination.pageNumber = params.pageNumber;
        else params.pagination.pageNumber = this.pagination.pageNumber;
        return params;
    }, setTotalNumber: function (params, totalNumber) {
        if( params.pagination === undefined ){
            // params.pagination = this.pagination;
            params.pagination = Object.create(this.pagination);
        }
        params.pagination.totalNumber = totalNumber|0;
        return params;
    }
};

