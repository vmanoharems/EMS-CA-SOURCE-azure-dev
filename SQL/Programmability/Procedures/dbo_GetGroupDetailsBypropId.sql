SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetGroupDetailsBypropId]
	-- Add the parameters for the stored procedure here
	@PropId int 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select  *from CompanyGroup where Prodid=@PropId
END




GO