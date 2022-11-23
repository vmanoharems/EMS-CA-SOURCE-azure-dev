SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[LedgerDump] 

@Companyid    INT           = NULL,
@PeriodIdFROM INT           = NULL,
@PeriodIdTo   INT           = NULL,
@ProdId       INT           = NULL,
@Location     NVARCHAR(100) = ''

AS
BEGIN

  SET NOCOUNT ON;   

  DECLARE @EFDateFrom  DATE          = '';
  DECLARE @EFDateTo    DATE          = '';
  DECLARE @Batch       NVARCHAR(200) = '';
  DECLARE @CreatedBy   NVARCHAR(50)  = '';
  DECLARE @TrStart     INT           = NULL;
  DECLARE @TrEND       INT           = NULL;
  DECLARE @DocumentNo  VARCHAR(100)  = '';
  DECLARE @TT          VARCHAR(50)   = '';
  DECLARE @VendorFrom  VARCHAR(50)   = '';
  DECLARE @VendorTo    VARCHAR(50)   = '';
  DECLARE @AccountFrom VARCHAR(50)   = '';
  DECLARE @AccountTo   VARCHAR(50)   = '';
  DECLARE @SortExpr    NVARCHAR(100) = 'Account';

  IF (@PeriodIdFROM < 1 OR @PeriodIDFrom IS NULL)
  BEGIN
     SET @PeriodIdFROM=(SELECT ClosePeriodID FROM ClosePeriod  WHERE CompanyId=@Companyid AND CompanyPeriod=1)
  END

  IF (@PeriodIdTo < 1 OR @PeriodIDTo is NULL)
  BEGIN
     SET @PeriodIdTo=dbo.GetCurrentOpenPeriodID(@CompanyID,default);
  END

  DECLARE @PeriodStatus NVARCHAR(1000) = [dbo].[RangetoWhereInString](@PeriodIDFrom,@PeriodIDTo);

  DECLARE @tz INT;
  SET @tz = dbo.tzforproduction(0);

  IF (@EFDateTo = '')
  BEGIN
     SET @EFDateTo = getdate();
  END

  DECLARE @CompanyCode VARCHAR(10);
  DECLARE @fiscalDate DATE;
  SET @CompanyCode= (SELECT CompanyCode FROM company WHERE Companyid=@Companyid);
  SET @fiscalDate=  (SELECT FiscalStartdate FROM company WHERE Companyid=@Companyid);

  IF (@TrStart='' OR @TrStart is NULL)
  BEGIN
     SET @TrStart=(SELECT MIN(CAST(transactionNumber AS INT)) FROM JournalEntry WHERE prodid=@ProdId);
  END

  IF (@Trend='' OR @TREND is NULL)
  BEGIN
     SET @Trend=(SELECT MAX(CAST(transactionNumber AS INT)) FROM JournalEntry WHERE prodid=@ProdId);
  END

  SELECT  A.Accountid,COA.COAID,
          A.AccountCode + '-' + A.AccountName AS AcctDescription,
          A.AccountCode AS Acct,
          JED.COAString + CASE WHEN theSETS.SetCode IS NOT NULL THEN '|'+theSETS.SetCode ELSE '' END AS COAString,
          dbo.convertcodes(ISNULL(JED.TransactionCodeString,'')) AS TransactionCode,
          ISNULL(JED.Note,'') AS LineDescription,
          ISNULL(JED.ThirdParty,0) AS ThirdParty,
          dbo.GetVendorByTransactionNo(CAST(JE.TransactionNumber AS INT)) AS VendorName,
          dbo.GetRefVendorByTransactionNo(CAST(JE.TransactionNumber AS INT)) AS RefVendor,
          dbo.GetVendorNameByTransactionNo(CAST(JE.TransactionNumber AS INT)) AS VendorID,
          JE.batchnumber,
          JE.TransactionNumber,JE.Source,
          ISNULL(CP.CompanyPeriod,0) AS ClosePeriod,
          ISNULL(JE.DocumentNo,'') AS DocumentNo,
          dbo.TZFROMUTC(JE.PostedDate,@tz) AS DocDate,
          ISNULL(JED.Note,'') AS Description,
          ISNULL(P.CheckNumber,'') AS CheckNumber,
          CAST(CASE WHEN A.AccountTypeID = 5 THEN - (JED.CreditAmount - JED.DebitAmount) ELSE JED.DebitAmount - JED.CreditAmount END AS money) AS Amount,
          CASE WHEN A.Accounttypeid=4 THEN dbo.GetBeginBal(COA.COAID,@fiscalDate,@EFDateFrom)*(-1) WHEN A.Accounttypeid>5 THEN dbo.GetBeginBal(COA.COAID,@fiscalDate,@EFDateFrom)*(-1)
          ELSE dbo.GetBeginBal(COA.COAID,@fiscalDate,@EFDateFrom) END AS BeginingBal,
          dbo.BreakCOA(COA.COACode,'Location') AS Location,
          JED.TaxCode,
          'USD' AS CurrencyCode,
          PO.PONumber AS PurchaseOrderNumber,
          P.paymentId,
          P.paymentDate,
          P.PaidAmount,
          INV.Amount AS InvoiceAmount,
          INV.BankId,
		  CRA.CheckRunID,
		  P.PayBy

    FROM JournalEntrydetail JED
      INNER JOIN JournalEntry JE ON JED.JournalEntryID=JE.JournalEntryid
      INNER JOIN COA COA ON JED.COAID=COA.COAID
      INNER JOIN tblAccounts A ON COA.AccountID=A.Accountid
      LEFT OUTER JOIN tblVendor V ON JED.Vendorid=V.Vendorid
      LEFT OUTER JOIN Closeperiod CP  ON JE.closeperiod=CP.ClosePeriodid
      LEFT OUTER JOIN Payment AS P ON JE.ReferenceNumber=P.PaymentID AND JE.SourceTable='Payment'
	  LEFT OUTER JOIN CheckRunAddon AS CRA ON CRA.PaymentID=P.PaymentID
      LEFT JOIN Invoice AS INV ON JE.ReferenceNumber=INV.InvoiceID AND JE.SourceTable='Invoice'
      LEFT JOIN InvoiceLine AS I ON JE.ReferenceNumber=I.InvoiceID AND COA.COAID = I.COAID AND JE.SourceTable='Payment'
      LEFT JOIN PurchaseOrderLine AS POL ON I.Polineid=POL.polineid
      LEFT JOIN PurchaseOrder AS PO ON POL.Poid=PO.poid
      LEFT JOIN (Select AccountID AS SetID, AccountCode AS SetCode FROM tblAccounts WHERE SegmentType = 'Set') AS theSETS ON JED.SetID = theSETS.SetID
      JOIN (SELECT transactionnumber FROM JournalEntry JE
           JOIN JournalEntryDetail JED ON JE.JournalEntryID = JED.JournalEntryID
           LEFT OUTER JOIN tblVendor V ON JED.Vendorid=V.Vendorid
           WHERE ((V.VendorName >= @VendorFrom) OR @VendorFrom='') AND ((V.VendorName <= @VendorTo) OR @VendorTo = '')
           GROUP BY transactionnumber) VFilter ON JE.transactionnumber = VFilter.transactionnumber

    WHERE JE.PostedDate IS NOT NULL
      AND CONVERT(DATE,dbo.TZFROMUTC(JE.Posteddate,@tz))  between @EFDateFrom AND @EFDateTo
      AND JE.AuditStatus = 'Posted'
      AND COA.SS1=@CompanyCode 
      AND (JE.ClosePeriod IN (SELECT * FROM dbo.SplitCSV(@PeriodStatus,',')) OR @PeriodStatus='')
      AND (JE.Batchnumber IN (SELECT * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='')
      AND CAST(JE.transactionNumber AS INT) between @TrStart AND @Trend
      AND (JE.BatchNumber IN (SELECT * FROM dbo.SplitCSV(@Batch,',')) OR @Batch='')
      AND (JE.CreatedBy IN (SELECT * FROM dbo.SplitCSV(@CreatedBy,',')) OR @CreatedBy='')
      AND (JE.DocumentNo=@DocumentNo OR @DocumentNo='')
      AND (JE.Source=@TT OR @TT='')
      AND ((COA.SS2 in(SELECT * FROM dbo.SplitCSV(@Location,','))) OR @Location='') 
      AND A.AccountCode IN (SELECT AccountCode FROM TblAccounts  WHERE ((AccountCode >=@AccountFrom) OR @AccountFrom='')
      AND ((AccountCode<=@AccountTo) OR @AccountTo = ''))

    ORDER BY
       CASE WHEN @SortExpr = 'Account' THEN A.AccountCode END ASC,
       CASE WHEN @SortExpr = 'Account' THEN dbo.BreakCOA(COA.COACode,'Location') END ASC,
       CAST(JE.TransactionNumber AS INT) ASC,
       COA.COACode ASC,
       COA.Detaillevel ASC

END
GO