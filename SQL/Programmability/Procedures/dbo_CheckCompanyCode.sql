SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[CheckCompanyCode]
(
@CompanyCode varchar(5),
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select count(CompanyCode) as CompanyCount from Company where ProdID=@ProdID and CompanyCode=@CompanyCode

END



GO