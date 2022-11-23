SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[TransFieldStatusChange]
(
@TransactionCodeID int,
@Status bit
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   
	update  TransactionCode set Status=@Status where TransactionCodeID=@TransactionCodeID 
END






GO