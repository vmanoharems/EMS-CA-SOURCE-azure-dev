CREATE PROCEDURE [dbo].ReportsCostReportJSON -- ReportsCostReportJSON '{"ProdID": 14, "Mode":1,"CompanyCode": "07","Location":"","BudgetID":1,"BudgetFieldID":1}'
(
@JSONParameters nvarchar(max)
)
AS
BEGIN
	if ISJSON(@JSONparameters) is null return
	declare @reportParameters nvarchar(max) = @JSONparameters; --JSON_QUERY(@JSONparameters,'$.reportparameters'); -- Start by pulling the reportparameters from the JSON

	declare	@ProdId int = isnull(JSON_VALUE(@reportParameters, '$.ProdID'),-1);
	declare @Mode int = JSON_VALUE(@reportParameters, '$.Mode');
	declare @CompanyCode varchar(50) = JSON_VALUE(@reportParameters, '$.CompanyCode');
	declare @Location varchar(50) = JSON_VALUE(@reportParameters, '$.Location');
	declare @BudgetID int = JSON_VALUE(@reportParameters, '$.BudgetID');
	declare @BudgetFileID int = JSON_VALUE(@reportParameters, '$.BudgetFile');
	PRINT @reportParameters;

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;

	select @CID=CompanyID from Company where CompanyCode=@CompanyCode and ProdID=@ProdID;

	if(@Mode=1)
	begin
		select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
		inner join Budget as b on a.Budgetid=b.BudgetId
		inner join Company as c on a.CompanyID=c.CompanyID
		where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID;
	end
	else if(@Mode=2)
	begin
		select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
		inner join Budget as b on a.Budgetid=b.BudgetId 
		inner join Company as c on a.CompanyID=c.CompanyID
		where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID
		and a.S2=@Location;
	end
	else if(@Mode=3)
	begin
		select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
		inner join Budget as b on a.Budgetid=b.BudgetId 
		inner join Company as c on a.CompanyID=c.CompanyID
		where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID
		and a.Budgetid=@BudgetID and a.BudgetFileID=@BudgetFileID;
	end

	

   
END




GO