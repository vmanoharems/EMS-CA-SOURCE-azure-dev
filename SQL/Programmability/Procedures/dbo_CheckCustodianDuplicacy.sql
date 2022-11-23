SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO


CREATE PROCEDURE [dbo].[CheckCustodianDuplicacy] -- CheckCustodianDuplicacy 2,'test',3
	-- Add the parameters for the stored procedure here
	@CustodianID int,
	@CustodianCode nvarchar(50),
	@ProdId int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	if   exists( select * from Custodian where CustodianCode=@CustodianCode and ProdId=@ProdId and CustodianID<>@CustodianID)
	begin
	select 1;
	end
	else
	begin
	select 0;
	end
END



GO