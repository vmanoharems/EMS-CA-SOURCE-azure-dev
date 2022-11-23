CREATE PROCEDURE [dbo].[GetCRWListForReport] -- GetCRWListForReport 66,3,'01','null',13,1
(
@ProdID int,
@Mode int,
@CompanyID varchar(50),
@Location varchar(50),
@BudgetID int,
@BudgetFileID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	declare @CID int;

	select @CID=CompanyID from Company where CompanyCode=@CompanyID and ProdID=@ProdID;

	if(@Mode=1)
	begin
	select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
	inner join Budget as b on a.Budgetid=b.BudgetId
	inner join Company as c on a.CompanyID=c.CompanyID
	 where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID;
	end
	else if(@Mode=2)
	begin
		-- CRWv2
		select -1 as BudgetID
		, -1 as BudgetFileID
		, 'Consolidated' as BudgetName
		 , '' as S1
		 , '' as S2
		 , '' as S3
		 , '' as CompanyName
		; -- Consolidated CRW

	--select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
	--inner join Budget as b on a.Budgetid=b.BudgetId 
	--inner join Company as c on a.CompanyID=c.CompanyID
	--where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID
	-- and a.S2=@Location;
	end
	else if(@Mode=3)
	begin
	-- CRWv2
		select B.BudgetID
		 , V.version as BudgetFileID
		 , B.BudgetName
		 , '' as S1
		 , '' as S2
		 , '' as S3
		 , '' as CompanyName
		 from Budgetv2 B
		 join (select BudgetID, max(version) as version from CRWv2 group by BudgetID) as V
		 on B.BudgetID = V.BudgetID
		where B.Active = 1
		and B.ProdID = @ProdID
		and (B.BudgetID = @BudgetID OR @BudgetID = 0)
		and (V.version = @BudgetFileID OR @BudgetID = 0)
	--select a.Budgetid,a.BudgetFileID,b.BudgetName,a.S1,a.S2,a.S3,c.CompanyName from BudgetFile as a
	--inner join Budget as b on a.Budgetid=b.BudgetId 
	--inner join Company as c on a.CompanyID=c.CompanyID
	--where a.Status='Processed'  and a.prodid=@ProdID and a.CompanyID=@CID
	-- and a.Budgetid=@BudgetID and a.BudgetFileID=@BudgetFileID;
	end

END




GO