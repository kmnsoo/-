module.exports = {
	//멀티 시트 테이블 생성을 허용할지
	canReadMultipleSheets : false,

	canReadMultiSheet : function () {
		return this.canReadMultipleSheets;
	}
};