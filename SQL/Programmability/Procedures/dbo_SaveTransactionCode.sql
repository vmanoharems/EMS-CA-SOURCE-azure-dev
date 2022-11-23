SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[SaveTransactionCode] 
(
@Description nvarchar(100),
@TransCode nvarchar(10),
@Status bit,
@ProdID int,
@CreatedBy int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   insert into TransactionCode (Description,TransCode,Status,ProdID,CreatedDate,CreatedBy)values
   (@Description,@TransCode,@Status,@ProdID,CURRENT_TIMESTAMP,@CreatedBy)
   select SCOPE_IDENTITY()
END





GO