SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetCompanyIdByGroupId]
	-- Add the parameters for the stored procedure here
@GroupId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	select c.CompanyID,c.CompanyCode,g.GroupID from GroupCompanyAccess G 
	left outer join Company  C on g.CompanyID=c.CompanyID
	
	 where g.GroupID=@GroupId
END



GO