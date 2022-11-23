SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[testing]  -- testing 54
@ProdId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
declare @Accounts table (
AccountID int, AccountCode varchar(50),AccountName nvarchar(50),BalanceSheet bit,
Status bit,Posting bit,SubLevel int,AccountTypeId int , code varchar(50)
,ParentID int,ParentCode nvarchar(50) ,Path1 varchar(100) , x varchar(100)
)

insert into @Accounts 
exec [dbo].[GetAccountDetailByProdId] @ProdId;
 

select * from @Accounts --  group by ParentCode , ParentID,SubLevel,AccountTypeId,AccountCode,code,Path1,x,Status,Posting,AccountName,BalanceSheet,AccountID
order by AccountTypeId,AccountCode --,AccountTypeId,ParentCode,AccountCode asc
END
GO