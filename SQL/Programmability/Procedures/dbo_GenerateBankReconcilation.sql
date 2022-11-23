SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GenerateBankReconcilation]
@BankID int,
@UserID int,
@ProdID int,
@StatementDate datetime,
@StatementEndingAmount varchar(50)
AS
BEGIN
SET NOCOUNT ON;
if exists(select Status from BankReconcilation where BankID=@BankID and Status='OPEN')
BEGIN
	select ReconcilationID from BankReconcilation where BankID=@BankID and Status='OPEN';
END
ELSE
BEGIN
	declare @RecID int;
	select @RecID=isnull(max(ReconcilationID),0) from BankReconcilation
	insert into BankReconcilation (ReconcilationID,BankID,Status,OpenDate,OpenBy,ProdID,StatementDate,StatementEndingAmount,DisplayAll,MarkVoided,CurrentUserID) values
	(@RecID+1,@BankID,'OPEN',CURRENT_TIMESTAMP,@UserID,@ProdID,@StatementDate,@StatementEndingAmount,0,0,@UserID);
	select @RecID+1 as ReconcilationID;
END
END
GO