SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

-- =============================================
CREATE PROCEDURE [dbo].[GetExchangeRate]
(
@CompanyID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

select a.CurrencyName,a.Currencycode,a.ExchangeRate,b.CompanyCode from Currecny as a left join Company as b on a.CompanyID=b.CompanyID
 where a.CompanyID=@CompanyID

END




GO