SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[SettingsTaxCodeGet]  -- SettingsTaxCodeGet  3,0 for entire list
@ProdId int,@TaxCodeId int
AS
BEGIN
-- SET NOCOUNT ON added to prevent extra result sets from
SET NOCOUNT ON;

select * from TaxCodeDetail
where ProdID = @ProdID
and (TaxID = @TaxCodeID or @TaxCodeID = 0)
order by TaxCode

end
GO