SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[CheckTransactionCodeField]
(
@TransactionCode varchar(5),
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select count(TransCode) as TransactionCodeCount from TransactionCode where ProdID=@ProdID and TransCode=@TransactionCode

END



GO