SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertUpdatePayrollTransValue]
(
@ExpenseID int,
@ModifyBy int,
@TransValueStr varchar(500),
@COAString varchar(500),
@SegmentString varchar(500),
@SegmentString1 varchar(500),
@SegmentString2 varchar(500),
@AccountNumber varchar(50),
@PayDescription varchar(100),
@SegmentStr1 varchar(100),
@TransactionStr1 varchar(100),
@SetID varchar(50),
@SeriesID varchar(50)
)
AS
BEGIN
	SET NOCOUNT ON;

insert into PayrollExpensePost (PayrollExpenseID,PaymentAmount,PayDescription,CreatedDate,PayrollUserID,PayrollFileID,TransactionString,SegmentString,COAID,COAString
	,AccountNumber,SegmentStr1,TransactionStr1,SetID,SeriesID,ExpenseType)
	select PayrollExpenseID,PaymentAmount,@PayDescription,CURRENT_TIMESTAMP,PayrollUserID,PayrollFileID,@TransValueStr,@SegmentString,'',@COAString
		,@AccountNumber,@SegmentString1,@TransactionStr1,@SetID,@SeriesID,ExpenseType from PayrollExpense where PayrollExpenseID=@ExpenseID;
	
END
GO