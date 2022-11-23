SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertBudgetFile]
(
@uploadedby int,
@Action nvarchar(20),
@LeaveexistingCOA int,
@CompanCode nvarchar(20),
@prodid int,
@Budgetid int,
@UploadedXML xml,
@S1 varchar(50),
@S2 varchar(50),
@S3 varchar(50),
@S4 varchar(50),
@S5 varchar(50),
@S6 varchar(50),
@S7 varchar(50),
@S8 varchar(50),
@LedgerLebel varchar(50),
@SegmentName varchar(500),
@SegStr1 varchar(500),
@SegStr2 varchar(500)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	Declare @CompanyID int;
	if exists(select CompanyID from company where CompanyCode=@CompanCode)
	begin
	select @CompanyID=CompanyID from company where CompanyCode=@CompanCode
	end
	else
	begin
	set @CompanyID=0;
	end
	

 insert into BudgetFile (Uploadeddate,uploadedby,Action,Status,LeaveexistingCOA,CompanCode,CompanyID,prodid,Budgetid,UploadedXML,S1,S2,S3,S4,S5,S6,LedgerLebel,SegmentName,SegStr1,SegStr2) values
                  (CURRENT_TIMESTAMP,@uploadedby,@Action,'Saved',@LeaveexistingCOA,@CompanCode,@CompanyID,@prodid,@Budgetid,@UploadedXML,@S1,@S2,@S3,@S4,@S5,@S6,@LedgerLebel,@SegmentName,@SegStr1,@SegStr2)
				
				declare @XMLID int;

				select @XMLID=max(BudgetFileID) from BudgetFile ;

				declare @XMLL xml;
				select @XMLL=uploadedXML from BudgetFile where BudgetFileID=@XMLID;


INSERT INTO BudgetCategory (cID,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal ,CategoryTotal,CategoryVariance,
createdby,BudgetID,
Createddate,Budgetfileid,S1,S2,S3,S4,S5,S6,S7,S8,COACODE)
    (  SELECT t.n.value('cID[1]', 'int') as cID,
t.n.value('cNumber[1]', 'nvarchar(50)') as cNumber,
t.n.value('cDescription[1]', 'nvarchar(50)') as cDescription,
t.n.value('cFringe[1]', 'nvarchar(50)') as cFringe,
t.n.value('cOriginal[1]', 'nvarchar(50)') as cOriginal,
t.n.value('cTotal[1]', 'nvarchar(50)') as cTotal,
t.n.value('cVariance[1]', 'nvarchar(50)') as cVariance,
@uploadedby,
@Budgetid ,CURRENT_TIMESTAMP,@XMLID,@S1,@S2,@S3,@S4,@S5,@S6,@S7,@S8,@SegStr1+'|'+t.n.value('cNumber[1]', 'nvarchar(50)')
FROM @XMLL.nodes('/budget/categories/category') as t(n));
				

  
insert into BudgetAccounts(CategoryId,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,
AccountVariance,BudgetID,CreatedDate,CreatedBy,BudgetFileID,COACODE)
 ( SELECT 
t.n.value('categoryID[1]', 'nvarchar(50)') as CategoryId,
t.n.value('aID[1]', 'nvarchar(50)') as AccountID,
t.n.value('aNumber[1]', 'nvarchar(50)') as AccountNumber,
t.n.value('aDescription[1]', 'nvarchar(50)') as AccountDesc,
t.n.value('aFringe[1]', 'nvarchar(50)') as AccountFringe,
t.n.value('aOriginal[1]', 'nvarchar(50)') as AccountOriginal,
t.n.value('aTotal[1]', 'nvarchar(50)') as AccountTotal,
t.n.value('aVariance[1]', 'nvarchar(50)') as AccountVariance,
@Budgetid ,
CURRENT_TIMESTAMP,
@uploadedby,@XMLID,@SegStr1+'|'+b.CategoryNumber+'>'+ t.n.value('aNumber[1]', 'nvarchar(50)') 
FROM @XMLL.nodes('/budget/accounts/account') as t(n)
left join BudgetCategory as b on  t.n.value('categoryID[1]', 'varchar(100)') =b.cid
and b.BudgetFileID=@XMLID);

--		if(@Budgetid=0)
--		begin
				 
insert into BudgetDetail(AccountID,AggPercent,DLocation,DetailSet,Description,Amount,Unit,X,Unit2,Currency,Rate,Unit3,Unit4,SubTotal,HiddenDfourthMlt,BudgetID,Createddate,CreatedBy,BudgetFileID)
 ( SELECT 
t.n.value('accountID[1]', 'nvarchar(50)') as AccountID,
t.n.value('dAggPercent[1]', 'nvarchar(50)') as AggPercent,
t.n.value('dLocation[1]', 'nvarchar(50)') as DLocation,
t.n.value('dSet[1]', 'nvarchar(50)') as DetailSet,
t.n.value('dDescription[1]', 'nvarchar(50)') as Description,
t.n.value('dAmount[1]', 'nvarchar(50)') as Amount,
t.n.value('dUnit[1]', 'nvarchar(50)') as Unit,
t.n.value('dX[1]', 'nvarchar(50)') as X,
t.n.value('dUnit2[1]', 'nvarchar(50)') as Unit2,
t.n.value('dCurrency[1]', 'nvarchar(50)') as Currency,
t.n.value('dRate[1]', 'nvarchar(50)') as Rate,
t.n.value('dUnit3[1]', 'nvarchar(50)') as Unit3,
t.n.value('dUnit4[1]', 'nvarchar(50)') as Unit4,
t.n.value('dSubtotal[1]', 'nvarchar(50)') as SubTotal,
t.n.value('hiddenDFourthMlt[1]', 'nvarchar(50)') as HiddenDfourthMlt,
@Budgetid ,
CURRENT_TIMESTAMP,
@uploadedby,@XMLID
FROM @XMLL.nodes('/budget/details/detail') as t(n))

--end


exec InsertDetailNumberInBudgetDetail @XMLID
exec InsertCOAIDForBudget @Budgetid,@XMLID,@prodid

select @XMLID;

END



GO