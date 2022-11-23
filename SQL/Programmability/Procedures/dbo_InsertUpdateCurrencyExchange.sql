SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
-- =============================================
CREATE PROCEDURE [dbo].[InsertUpdateCurrencyExchange] 
	(
	@CompanyID int,
	@CurrencyName nvarchar(50),
	@Currencycode nvarchar(10),
	@ExchangeRate decimal(18, 2),
	@createdby int,
	@DefaultFlag bit,
	@ProdID int
	)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  insert into Currecny (CompanyID,CurrencyName,Currencycode,ExchangeRate,Status,createddate,createdby,DefaultFlag,ProdID) values
  (@CompanyID,@CurrencyName,@Currencycode,@ExchangeRate,'Active',CURRENT_TIMESTAMP,@createdby,@DefaultFlag,@ProdID)


END





GO