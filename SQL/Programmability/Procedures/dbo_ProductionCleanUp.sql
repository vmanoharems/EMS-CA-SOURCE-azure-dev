SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[ProductionCleanUp]
	@ProdID int,
	@EmailId nvarchar(50),
	@UserId int
AS
BEGIN
	
	SET NOCOUNT ON;

--Truncate table CRWNotesNew
--Truncate table tblVendor
--Truncate table BudgetAccounts
--Truncate table BudgetCategory
--Truncate table PayrollUser
--Truncate table Company
--Truncate table PayrollExpense
--Truncate table CompanyGroup
--Truncate table PayrollExpensePost
--Truncate table COA
--Truncate table PurchaseOrderLine
--Truncate table CompanySetting
--Truncate table PurchaseOrder
--Truncate table Currecny
--Truncate table GroupCompanyAccess
--Truncate table CRW
--Truncate table GroupPermission
--Truncate table UserProfileAP
--Truncate table InvoiceLine
--Truncate table BudgetDetailFinal
--Truncate table Mydefault
--Truncate table Invoice
--Truncate table BudgetCategoryFinal
--Truncate table Production
--Truncate table SearchCriteria
--Truncate table Segementvalue
--Truncate table BudgetAccountsFinal
--Truncate table StartingValue
--Truncate table taxinfo
--Truncate table EstimatedCost
--Truncate table PaymentLine
--Truncate table Payment
--Truncate table BudgetFile
--Truncate table UserAccess
--Truncate table PayrollOffset
--Truncate table AccountClearing
--Truncate table PayrollExpenseItem
--Truncate table BudgetDetail
--Truncate table VendorInfo
--Truncate table PayrollFreeField
--Truncate table PayrollBankSetup
--Truncate table CRWNotes
--Truncate table MyConfig
--Truncate table PayrollChecks
--Truncate table CheckRun
--Truncate table CheckRunAddon
--Truncate table TblAccounts
--Truncate table PayrollFringeHeader
--Truncate table Custodian
--Truncate table PayrollFringeAddon
--Truncate table Recipient
--Truncate table PCEnvelopeLine
--Truncate table PCEnvelope
--Truncate table BatchNumbers
--Truncate table TransactionCode
--Truncate table TransactionValue
--Truncate table JournalEntryDetailAddon
--Truncate table Segment
--Truncate table Accountaddon
--Truncate table Accountcategory
--Truncate table Accountdetails
--Truncate table ClosePeriod
--Truncate table AccountMaster
--Truncate table JournalEntryDetail
--Truncate table PayrollFile
--Truncate table CheckSetting
--Truncate table SegmentLedger
--Truncate table JournalEntry
--Truncate table LedgerAccounts
--Truncate table BankInfo
--Truncate table Budget
--Truncate table causers
----------Update---------------
update SourceCode set ProdID=@ProdID;
update AccountType set ProdID=@ProdID;
update CompanyGroup set ProdID=@ProdID
update GroupPermission set ProdID=@ProdID
----------End--------------
INSERT [dbo].[Segment] ([SegmentCode], [SegmentName], [SegmentReportDescription], [Classification], [CodeLength], 
[SegmentLevel], [DetailFlag], [ProdId], [CreatedDate], [CreatedBy], [ModifiedDate], [ModifiedBy], [SegmentStatus], [SubAccount1],
 [SubAccount2], [SubAccount3], [SubAccount4], [SubAccount5], [SubAccount6])
  VALUES ('CO','Company','Company','Company','##', 1, 0, @ProdID, getdate(),
   1, NULL, NULL,'Working', NULL, NULL, NULL, NULL, NULL, NULL)

---------------------/// Create User

exec InsertOnlyCausersbyemailID @userId,@EmailId,@ProdID;

select @ProdID
END








GO