SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollDataFileFill]   --- exec GetPayrollDataFileFill 16
(
--@ProdID int,
@PayrollFileID int
)
AS
BEGIN
	
	SET NOCOUNT ON;

declare @CID int;
declare @ProdID int;
declare @AID int;
declare @AccountCodeSus varchar(100);

select @CID=CompanyID,@ProdID=ProdID from PayrollFile where PayrollFileID=@PayrollFileID

select @AID=isnull(b.AccountId,0)   from AccountClearing a inner Join COA b on a.COAId=b.COAID where 
 a.AccountName='Suspense' and a.Type='Payroll'
 and a.CompanyId=@CID and a.ProdID=@ProdID;


select @AccountCodeSus = isnull(AccountCode,'') from TblAccounts where AccountId=@AID and ProdId=@ProdID;

select ('Check#:'+b.CheckNumber+' for '+b.LastName+' ,'+b.FirstName) as Header,a.PayrollExpenseID,
a.PayDescription,a.PaymentAmount,a.TransactionString,c.Status,a.SegmentString ,isnull(a.PaymentAccount,'') as PaymentAccount
,isnull(d.AccountId,'') as AccountID,
 a.LocationCode,a.SetCode,a.EpisodeCode ,@AccountCodeSus as SuspendAccount,Freefield1,Freefield2,FreeField3
from PayrollExpense as a
inner join PayrollUser as b on a.PayrollUserID=b.PayrollUserID
inner join PayrollFile as c on a.PayrollFileID=c.PayrollFileID
left join TblAccounts as d on a.PaymentAccount=d.AccountCode and d.SegmentType='Detail'
where a.PayrollFileID=@PayrollFileID --and d.SegmentType='Detail'
group by b.CheckNumber,b.FirstName,
b.LastName,a.PayrollExpenseID,a.PayDescription,a.PaymentAmount,a.TransactionString,c.Status,a.SegmentString,a.PaymentAccount,
d.AccountId,a.LocationCode,a.SetCode,a.EpisodeCode,Freefield1,Freefield2,FreeField3



END






GO