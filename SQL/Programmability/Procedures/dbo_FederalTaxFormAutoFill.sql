SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[FederalTaxFormAutoFill]
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select '1099' as FederalTaxID,'1099' as FederalTaxValue

END



GO