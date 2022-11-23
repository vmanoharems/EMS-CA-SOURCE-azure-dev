SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetAllTransactionValue]
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 
select a.TransactionValueID,b.TransCode,a.TransValue,a.Status,isnull(a.Description,'') as Description  from TransactionValue as a inner join TransactionCode as b
on a.TransactionCodeID=b.TransactionCodeID where a.ProdID=@ProdID order by a.TransactionValueID desc


END



GO