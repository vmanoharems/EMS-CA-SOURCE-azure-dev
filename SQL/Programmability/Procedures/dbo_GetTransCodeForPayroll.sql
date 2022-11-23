SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetTransCodeForPayroll]
(
@ProdID int 
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  select TransactionCodeID,TransCode from TransactionCode where ProdID=@ProdID and Status='1'

END



GO