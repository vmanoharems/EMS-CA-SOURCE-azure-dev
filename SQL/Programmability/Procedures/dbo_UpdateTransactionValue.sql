SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[UpdateTransactionValue]
(
@TransactionValueID int,
@TransValue nvarchar(50),
@Description nvarchar(50),
@Status bit,
@ModifiedBy int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  update TransactionValue set TransValue=@TransValue,Description=@Description ,Status=@Status ,Modifiedate=CURRENT_TIMESTAMP,ModifiedBy=@ModifiedBy where TransactionValueID=@TransactionValueID

END



GO