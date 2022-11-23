SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO




-- =============================================
CREATE PROCEDURE [dbo].[GetPayrollDataFileForAudit]   --- exec GetPayrollDataFileForAudit 1
(
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


select @AID=isnull(b.AccountId,0)   from AccountClearing a inner Join COA b on a.COAId=b.COAID where  a.AccountName='Suspense' and a.Type='Payroll'
 and a.CompanyId=@CID and a.ProdID=@ProdID;

select @AccountCodeSus = isnull(AccountCode,'') from TblAccounts where AccountId=@AID and ProdId=@ProdID;



select ('Check#:'+b.CheckNumber+' for '+b.LastName+' ,'+b.FirstName) as Header,a.PayrollExpenseID,
a.PayDescription,a.PaymentAmount,a.TransactionString,c.Status,a.SegmentString ,isnull(a.AccountNumber,'') as PaymentAccount,isnull(d.AccountId,'') as AccountID,
 a.LocationCode,a.SetCode,a.EpisodeCode,a.COAString,@AccountCodeSus as SuspendAccount,
 b.FirstName,b.LastName,b.CheckNumber,b.TotalPaymentAmount,b.SSN
from PayrollExpensePost as a
inner join PayrollUser as b on a.PayrollUserID=b.PayrollUserID
inner join PayrollFile as c on a.PayrollFileID=c.PayrollFileID
left join TblAccounts as d on a.AccountNumber=d.AccountCode and d.SegmentType='Detail'
where a.PayrollFileID=@PayrollFileID 

group by b.CheckNumber,b.FirstName,
b.LastName,a.PayrollExpenseID,a.PayDescription,a.PaymentAmount,a.TransactionString,c.Status,a.SegmentString,a.AccountNumber,
d.AccountId,a.LocationCode,a.SetCode,a.EpisodeCode,a.COAString,
 b.FirstName,b.LastName,b.CheckNumber,b.TotalPaymentAmount,b.SSN


END





GO