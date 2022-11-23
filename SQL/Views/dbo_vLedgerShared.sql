SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
create view [dbo].[vLedgerShared]
as
select A.Accountid,COA.COAID, A.AccountCode+'-'+A.AccountName as AcctDescription , A.AccountCode as Acct,
       JED.COAString+case when theSETS.SetCode is not null then '|'+theSETS.SetCode else '' end as COAString
	   ,dbo.convertcodes(Isnull(JED.TransactionCodeString,''))as TransactionCode,
       Isnull(JED.Note,'') as LineDescription,Isnull(JED.ThirdParty,0) as ThirdParty
	         
	   ,dbo.GetVendorByTransactionNo(cast(JE.TransactionNumber as int)) as VendorName
	   ,dbo.GetRefVendorByTransactionNo(cast(JE.TransactionNumber as int)) as RefVendor	
	   ,dbo.GetVendorNameByTransactionNo(cast(JE.TransactionNumber as int)) as VendorID
	   ,JE.batchnumber

	   ,JE.TransactionNumber,JE.Source,Isnull(CP.CompanyPeriod,0) as ClosePeriod
	   , isnull(JE.DocumentNo,'') as DocumentNo,JE.PostedDate
	   
	   , isnull(JED.Note,'') as Description
	   , isnull(P.CheckNumber,'') as CheckNumber
		,cast(case when A.AccountTypeID = 5 then -(JED.CreditAmount - JED.DebitAmount) else JED.DebitAmount - JED.CreditAmount end  as money) as Amount
		,JED.DebitAmount, JED.CreditAmount
	  ,dbo.BreakCOA(COA.COACode,'Location') as Location
	  ,JED.TaxCode
	  ,JED.JournalEntryDetailID
	  SS1, SS2, SS3, SS4, SS5
	  , A.AccountTypeID
	  ,detaillevel
	  from JournalEntrydetail JED
	  Inner Join JournalEntry JE on JED.JournalEntryID=JE.JournalEntryid
      Inner Join COA COA on JED.COAID=COA.COAID
	  Inner Join tblAccounts A on COA.AccountID=A.Accountid
      Left Outer Join tblVendor V on JED.Vendorid=V.Vendorid 
	  Left Outer Join Closeperiod CP  on JE.closeperiod=CP.ClosePeriodid
     left outer join Payment as P on JE.ReferenceNumber=P.PaymentID and JE.SourceTable='Payment'
	 left join InvoiceLine as I on JE.ReferenceNumber=I.InvoiceID and COA.COAID = I.COAID and JE.SourceTable='Payment' 
	 left join PurchaseOrderLine as POL on I.Polineid=POL.polineid
	  left join PurchaseOrder as PO on POL.Poid=PO.poid
  	  left join (Select AccountID as SetID, AccountCode as SetCode from tblAccounts where SegmentType = 'Set') as theSETS on JED.SetID = theSETS.SetID

      where  JE.PostedDate is not null 
	  and JE.AuditStatus = 'Posted'
GO