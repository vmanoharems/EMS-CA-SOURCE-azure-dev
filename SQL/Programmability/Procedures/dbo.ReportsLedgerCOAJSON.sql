SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[ReportsLedgerCOAJSON]
--declare @JSONparameters as varchar(max) = '{"Companyid":1,"PeriodStatus":null,"ProdId":14,"EFDateFrom":"0001-01-01T00:00:00","EFDateTo":"0001-01-01T00:00:00","Batch":null,"CreatedBy":null,"TrStart":0,"Trend":0,"UserID":1,"ReportDate":"07/03/2017","DocumentNo":null,"TransactionType":null,"Location":"","VendorFrom":null,"VendorTo":null,"AccountFrom":"0001-00","AccountTo":"0200-00","UserName":null}'
@JSONparameters as varchar(8000)
AS
BEGIN
	if ISJSON(@JSONparameters) is null return

	declare @reportParameters varchar(8000) = @JSONparameters; --JSON_QUERY(@JSONparameters,'$.reportparameters'); -- Start by pulling the reportparameters from the JSON

	declare	@ProdId int = isnull(JSON_VALUE(@reportParameters,'$.ProdId'),-1);
	declare	@CompanyId int = isnull(JSON_VALUE(@reportParameters,'$.CompanyId'),-1);
	declare	@AccountFrom nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.AccountFrom'),'');
	declare	@AccountTo nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.AccountTo'),'');
	declare	@Locations nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.Locations'),'');
	declare	@AccountType nvarchar(50) = isnull(JSON_VALUE(@reportParameters,'$.AccountType'),'');

	select
		COA.AccountID,
		AccountCode,
		AccountName,
		BalanceSheet,
		A.Status,
		Posting,
		SubLevel,
		A.AccountTypeId,
		AT.Code,
		ParentID,
		ParentCode,
		COA.COACode as [path]
		,null as x
	from COA
	join tblAccounts A
	on COA.AccountID = A.AccountID
	join AccountType AT
	on A.AccountTypeID = AT.accountTypeID
	where
		COA.ProdID = @ProdID
--	and COA.CompanyID = @CompanyID -- Not needed since all companies have the same COA
	and ((A.AccountCode >= @AccountFrom) or @AccountFrom = '')
	and ((A.AccountCode <= @AccountTo) or @AccountTo = '')
	and ((COA.SS2 in (select * from dbo.splitCSV(@Locations,','))) or @Locations = '')
	and ((AT.Code in (select * from dbo.splitCSV(@AccountType,','))) or @AccountType = '')
	order by A.AccountTypeID,COA.COACode
END
GO