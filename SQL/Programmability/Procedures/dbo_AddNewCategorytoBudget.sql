SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[AddNewCategorytoBudget]
(
@Budgetfileid int,
@CategoryNumber varchar(50),
@CategoryDescription varchar(100),
@CategoryFringe varchar(50),
@CategoryTotal varchar(50),
@ProdID int,
@createdby int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	

	declare @MaxCid int;
	declare @BudgetID int;
	declare @Str1 varchar(100);

	select @Str1=SegStr1,@BudgetID=BudgetID from BudgetFile where BudgetFileID=@Budgetfileid;

    select @MaxCid=max(cid) from BudgetCategory where Budgetfileid=@Budgetfileid;

	declare @SSS1 varchar(50);
	declare @SSS2 varchar(50);
	declare @SSS3 varchar(50);
	declare @SSS4 varchar(50);
	declare @SSS5 varchar(50);
	declare @SSS6 varchar(50);
	declare @SSS7 varchar(50);
	declare @SSS8 varchar(50);

	DECLARE @SegLevel int;

	 select top(1) @SSS1=S1,@SSS2=S2,@SSS3=S3,@SSS4=S4,@SSS5=S5,@SSS6=S6,@SSS7=S7,@SSS8=S8 
	 from BudgetCategory where Budgetfileid=@Budgetfileid;

	
	 insert into BudgetCategory (cid,CategoryNumber,CategoryDescription,CategoryFringe,CategoryTotal,Budgetfileid
	 ,Createddate,createdby,BudgetID,S1,S2,S3,S4,S5,S6,S7,S8,COACODE) values
	(@MaxCid+1,@CategoryNumber,@CategoryDescription,@CategoryFringe,@CategoryTotal,@Budgetfileid,CURRENT_TIMESTAMP
	,@createdby,@BudgetID,@SSS1,@SSS2,@SSS3,@SSS4,@SSS5,@SSS6,@SSS7,@SSS8,@Str1+'|'+@CategoryNumber)

	
	 select @Budgetfileid;
  
END



GO