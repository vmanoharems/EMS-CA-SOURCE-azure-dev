SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetStartingCheckNumber]
(
@BankId int,
@ProdId int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   declare @CheckNo int
   set @CheckNo=( select  CONVERT(INT, StartNumber) from CheckSetting where BankId=@BankId and ProdId=@ProdId)

   select 'Check' as Type ,@CheckNo as CheckNumber


END



GO