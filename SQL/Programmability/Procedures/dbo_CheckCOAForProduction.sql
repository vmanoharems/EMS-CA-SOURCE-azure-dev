SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[CheckCOAForProduction]
(
@ProdID int
)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

  if exists (select top(1)* from COA where ProdId=@ProdID)
  begin
   select 1;
  end
  else
  begin
   select 0;
  end

END



GO