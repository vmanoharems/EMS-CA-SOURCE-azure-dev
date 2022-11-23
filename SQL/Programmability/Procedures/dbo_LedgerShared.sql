﻿SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[LedgerShared] -- LedgerInquiry 1,'',60,'09/01/2015','10/25/2017','','',NULL,NULL,'','','','','','',''
--declare
@PCompanyid int = null,
@PPeriodStatus nvarchar(50)='',
@PProdId int = null,
@PEFDateFrom date = '',
@PEFDateTo Date ='',
@PBatch nvarchar(200)='',
@PCreatedBy nvarchar(50)='',
@PTrStart int = null,
@PTrend int = null,

@PDocumentNo varchar(100)='',
@PTT varchar(50)='',
@PVendorFrom varchar(50)='',
@PVendorTo varchar(50)='',
@PLocation varchar(50)='',
@PAccountFrom varchar(50)='',
@PAccountTo varchar(50)=''
,@PSortExpr nvarchar(100)=''

WITH RECOMPILE 
AS
BEGIN
declare 
@Companyid int = @PCompanyid,
@PeriodStatus nvarchar(50)=@PPeriodStatus,
@ProdId int = @PProdID,
@EFDateFrom date = @PEFDateFrom,
@EFDateTo Date =@PEFDateTO,
@Batch nvarchar(200)=@PBatch,
@CreatedBy nvarchar(50)=@PCreatedby,
@TrStart int = @PTrStart,
@Trend int = @PTrend,

@DocumentNo varchar(100)=@PDocumentNo,
@TT varchar(50)=@PTT,
@VendorFrom varchar(50)=@PVendorFrom,
@VendorTo varchar(50)=@PVendorTo,
@Location varchar(50)=@PLocation,
@AccountFrom varchar(50)=@PAccountFrom,
@AccountTo varchar(50)=@PAccountTo
,@SortExpr nvarchar(100)=@PSortExpr
;

	SET NOCOUNT ON;

declare @tz  int;
set @tz = dbo.tzforproduction(0);

	if (@EFDateTo = '')
		begin
			set @EFDateTo = getdate();
		end

	declare @CompanyCode varchar(10),@fiscalDate date;
	set @CompanyCode= (select CompanyCode from company where Companyid=@Companyid);
	set @fiscalDate=  (select FiscalStartdate from company where Companyid=@Companyid);
	if @EFDatefrom < @fiscalDate
		set @EFDatefrom = @fiscalDate;

	If (@TrStart='' or @TrStart is null)
		begin
			set @TrStart=(select min(cast(transactionNumber as int)) from JournalEntry  where prodid=@ProdId)
			print @TrStart;
		end

	If (@Trend='' or @TRend is null)
		begin
			set @Trend=(select Max(cast(transactionNumber as int)) from JournalEntry  where prodid=@ProdId)
			print @Trend;
		end

select --JournalEntryDetailID,
		A.Accountid,COA.COAID, A.AccountCode+'-'+A.AccountName as AcctDescription , A.AccountCode as Acct
	   ,COA.COACode + case when theSETS.SetCode is not null then '|'+theSETS.SetCode else '' end as COAString -- Using COA to build string instead of JED as JED can become corrupted
	   ,dbo.convertcodes(Isnull(JED.TransactionCodeString,''))as TransactionCode,
       Isnull(JED.Note,'') as LineDescription
	   ,Isnull(JED.ThirdParty,0) as ThirdParty
	         
/*	   ,dbo.GetVendorByTransactionNo(cast(JE.TransactionNumber as int)) as VendorName
	   ,dbo.GetRefVendorByTransactionNo(cast(JE.TransactionNumber as int)) as RefVendor	
	   ,dbo.GetVendorNameByTransactionNo(cast(JE.TransactionNumber as int)) as VendorID
*/
		, VFilter.VendorName
		, '' as RefVendor
		, VFilter.VendorID
	   ,JE.batchnumber

	   ,JE.TransactionNumber,JE.Source
	   ,Isnull(CP.CompanyPeriod,0) as ClosePeriod
	   , isnull(JE.DocumentNo,'') as DocumentNo
	   ,dbo.TZfromUTC(JE.PostedDate,@tz) as DocDate
	   
	   , isnull(JED.Note,'') as Description
	   , isnull(P.CheckNumber,'') as CheckNumber
		,cast(case when A.AccountTypeID = 5 then -(JED.CreditAmount - JED.DebitAmount) else JED.DebitAmount - JED.CreditAmount end  as money) as Amount

--	  ,dbo.GetBeginBal(COA.COAID,@fiscalDate,@EFDateFrom) as BeginingBal
	  , BB.BeginningBalance as BeginingBal

	  ,dbo.BreakCOA(COA.COACode,'Location') as Location
	  ,JED.TaxCode

	  from JournalEntrydetail JED
	  Inner Join JournalEntry JE on JED.JournalEntryID=JE.JournalEntryid
      Inner Join COA COA on JED.COAID=COA.COAID
	  Inner Join tblAccounts A on COA.AccountID=A.Accountid
	  join (
			select COA.COAID
				, sum(case when JE.posteddate <@EFDateFrom then DebitAmount else 0 end ) 
					- sum(case when JE.posteddate <@EFDateFrom then CreditAmount else 0 end) as BeginningBalance
			from COA 
				left join JournalEntryDetail JED on COA.COAID = JED.COAID
				left join JournalEntry JE on JED.JournalEntryID = JE.JournalEntryID
			group by COA.COAID
			) as BB on JED.COAID = BB.COAID
--      Left Outer Join tblVendor V on JED.Vendorid=V.Vendorid 
	  Left Outer Join Closeperiod CP  on JE.closeperiod=CP.ClosePeriodid
     left outer join Payment as P on JE.ReferenceNumber=P.PaymentID and JE.SourceTable='Payment'
	 left join InvoiceLine as I on JE.ReferenceNumber=I.InvoiceID and COA.COAID = I.COAID and JE.SourceTable='Payment' 
	 left join PurchaseOrderLine as POL on I.Polineid=POL.polineid
	  left join PurchaseOrder as PO on POL.Poid=PO.poid
  	  left join (Select AccountID as SetID, AccountCode as SetCode from tblAccounts where SegmentType = 'Set') as theSETS on JED.SetID = theSETS.SetID

	  join (select transactionnumber,max(V.VendorName) as VendorName, max(V.VendorID) as VendorID,count(*) as JEDCount from JournalEntry JE
			Join JournalEntryDetail JED on JE.JournalEntryID = JED.JournalEntryID
			Left Outer Join tblVendor V on JED.Vendorid=V.Vendorid
			where ((V.VendorName >= @VendorFrom) or @VendorFrom='') and ((V.VendorName <= @VendorTo) or @VendorTo = '')
			and AuditStatus = 'Posted'
			group by transactionnumber 
			) VFilter on JE.transactionnumber = VFilter.transactionnumber
      where  JE.PostedDate is not null 
	 and convert(date,dbo.TZfromUTC(JE.Posteddate,@tz))  between @EFDateFrom and @EFDateTo
	  --and JE.Posteddate-cast(@tz as datetime) between @EFDateFrom and @EFDateTo
	  and JE.AuditStatus = 'Posted'
	 and COA.SS1=@CompanyCode --and b.ClosePeriod between @PeriodIdfrom and @PeriodIdTo 
	  and (JE.ClosePeriod in (select * from dbo.SplitCSV(@PeriodStatus,',')) or @PeriodStatus='')
	  --and JE.ClosePeriod in(select ClosePeriodid from ClosePeriod where CompanyId=@Companyid and PeriodStatus in @PeriodStatus)
	  and (JE.Batchnumber in (select * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='') 
	  and cast(JE.transactionNumber as int) between @TrStart and @Trend
	  and (JE.BatchNumber in (select * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='') 
	  and (JE.CreatedBy in (select * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')

	  and (JE.DocumentNo=@DocumentNo OR @DocumentNo='') 
    and (JE.Source=@TT OR @TT='') 
	and ((COA.SS2 in(select * FROM dbo.SplitCSV(@Location,','))) or @Location='') --	and (dbo.BreakCOA(JED.COAString,'Location')=@Location or @Location='')
--	and ((V.VendorName >= @VendorFrom) or @VendorFrom='') and ((V.VendorName <= @VendorTo) or @VendorTo = '') --	and dbo.GetVendorNameByTransactionNo(cast(JE.TransactionNumber as int)) in (select VendorID from tblVendor where VendorName >=@VendorFrom and  VendorName<=@VendorTo)
	 and A.AccountCode in (select AccountCode from TblAccounts  where ((AccountCode >=@AccountFrom) or @AccountFrom='')
						 and  ((AccountCode<=@AccountTo) or @AccountTo = ''))
/**/
	  Order By
	  case when @SortExpr = 'Account' then A.AccountCode end ASC
	  , case when @SortExpr = 'Account' then dbo.BreakCOA(COA.COACode,'Location') end ASC
	  , cast(JE.TransactionNumber as int)  asc
	  , COA.COACode ASC
	  , COA.Detaillevel asc
	   
end










GO