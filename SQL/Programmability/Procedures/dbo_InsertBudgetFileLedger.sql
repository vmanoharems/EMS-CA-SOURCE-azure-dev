SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[InsertBudgetFileLedger]
(
@uploadedby int,
@prodid int,
@UploadedXML xml
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


 insert into BudgetFile (Uploadeddate,uploadedby,Status,Action,LeaveexistingCOA,CompanCode,CompanyID,prodid,Budgetid,UploadedXML) values
                  (CURRENT_TIMESTAMP,@uploadedby,'Saved','Initial Load',0,'00',0,@prodid,0,@UploadedXML)
				
				declare @XMLID int;

				select @XMLID=max(BudgetFileID) from BudgetFile ;

				declare @XMLL xml;
				select @XMLL=uploadedXML from BudgetFile where BudgetFileID=@XMLID;



  INSERT INTO BudgetCategory (cID,CategoryNumber,CategoryDescription,CategoryFringe,CategoryOriginal ,CategoryTotal,CategoryVariance,createdby,BudgetID,Createddate,Budgetfileid)
    (  SELECT t.n.value('cID[1]', 'int') as cID,
t.n.value('cNumber[1]', 'nvarchar(50)') as cNumber,
t.n.value('cDescription[1]', 'nvarchar(50)') as cDescription,
t.n.value('cFringe[1]', 'nvarchar(50)') as cFringe,
t.n.value('cOriginal[1]', 'nvarchar(50)') as cOriginal,
t.n.value('cTotal[1]', 'nvarchar(50)') as cTotal,
t.n.value('cVariance[1]', 'nvarchar(50)') as cVariance,
@uploadedby,
0 ,CURRENT_TIMESTAMP,@XMLID
FROM @XMLL.nodes('/budget/categories/category') as t(n));
				
insert into BudgetAccounts(CategoryId,AccountID,AccountNumber,AccountDesc,AccountFringe,AccountOriginal,AccountTotal,AccountVariance,BudgetID,CreatedDate,CreatedBy,BudgetFileID)
 ( SELECT 
t.n.value('categoryID[1]', 'nvarchar(50)') as CategoryId,
t.n.value('aID[1]', 'nvarchar(50)') as AccountID,
t.n.value('aNumber[1]', 'nvarchar(50)') as AccountNumber,
t.n.value('aDescription[1]', 'nvarchar(50)') as AccountDesc,
t.n.value('aFringe[1]', 'nvarchar(50)') as AccountFringe,
t.n.value('aOriginal[1]', 'nvarchar(50)') as AccountOriginal,
t.n.value('aTotal[1]', 'nvarchar(50)') as AccountTotal,
t.n.value('aVariance[1]', 'nvarchar(50)') as AccountVariance,
0 ,
CURRENT_TIMESTAMP,
@uploadedby,@XMLID
FROM @XMLL.nodes('/budget/accounts/account') as t(n))
	

					 
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
0 ,
CURRENT_TIMESTAMP,
@uploadedby,@XMLID
FROM @XMLL.nodes('/budget/details/detail') as t(n))




select @XMLID;

END



GO