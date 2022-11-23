SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[LedgerBible1] -- LedgerBible 1,1,1008,54,''

--- LedgerBible1 1,'','',54,''
	@Companyid int,	@PeriodIdfrom int,	@PeriodIdTo int,@ProdId int,
	@LO nvarchar(100)
AS
BEGIN
	SET NOCOUNT ON;

	declare @CompanyCode varchar(10),@fiscalDate date;
	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);
	If (@PeriodIdfrom<1)
	begin
	set @PeriodIdfrom=(select ClosePeriodID from ClosePeriod  where CompanyId=@Companyid and CompanyPeriod=1)
	end

		If (@PeriodIdTo<1)
	begin
	set @PeriodIdTo=(select Max(ClosePeriodID) from ClosePeriod  where CompanyId=@Companyid and Status='Open')
	end

select  e.Accountid,d.COAID,  e.AccountCode+'-'+e.AccountName as AcctDescription , e.AccountCode as Acct,
       a.COAString,dbo.convertcodes(Isnull(a.TransactionCodeString,''))as TransactionCode,
       Isnull(a.Note,'') as LineDescription,Isnull(a.ThirdParty,0) as ThirdParty,
       Isnull(c.VendorName,'') as VendorName,a.VendorID,b.TransactionNumber,b.Source,Isnull(x.CompanyPeriod,0) as ClosePeriod,
	   isnull(b.DocumentNo,'') as DocumentNo,b.PostedDate as DocDate,
	  case when e.Accounttypeid=4 then  Isnull((a.DebitAmount-a.CreditAmount),0) when e.Accounttypeid>5 then  Isnull((a.DebitAmount-a.CreditAmount),0)
	else Isnull((a.DebitAmount-a.CreditAmount),0) end as Amount,
	 0 as BeginingBal , b.JournalEntryID
	  from JournalEntrydetail a Inner Join JournalEntry b on a.JournalEntryID=b.JournalEntryid
      Inner Join COA d on a.COAID=d.COAID Inner Join tblAccounts e on d.AccountID=e.Accountid
      Left Outer Join tblVendor c on a.Vendorid=c.Vendorid 
	  Left Outer Join Closeperiod x  on b.closeperiod=x.ClosePeriodid
      where  b.PostedDate is not null  --and b.Posteddate between @EFDateFrom and @EFDateTo
	  and d.SS1=@CompanyCode and b.ClosePeriod between @PeriodIdfrom and @PeriodIdTo 
	  and (dbo.BreakCOA(a.COAString,'Location') in (select * FROM dbo.SplitCSV(@LO,',')) OR @LO='')  Order By a.COAString,d.DetailLevel,b.closeperiod,cast(b.TransactionNumber as int) asc
	  end
GO