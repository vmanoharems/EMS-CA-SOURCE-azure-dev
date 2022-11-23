SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[GetTransCodeFromExpense]   --exec GetTransCodeFromExpense '1,6,20,21,32,'
(
@TransStr varchar(500)
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

 
 select TransCode,TransactionCodeID  from TransactionCode where TransactionCodeID in (select * from  SplitCSV(@TransStr,',')) 
 order by TransactionCodeID ;
END



GO