SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO
CREATE PROCEDURE [dbo].[GetModulesDetails] 
	-- Add the parameters for the stored procedure here
	@GroupId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
  select Module.ModuleId,Module.ModuleName,Isnull(ParentID,0) ParentId,ModuleLevel, Isnull(Access,'No Access')  Access 
 ,isnull(children,0)as Children
from Module  Left outer Join
 GroupPermission on Module.ModuleId=GroupPermission.ModuleID where GroupId=@GroupId
 Union 
  select  Module.ModuleId,Module.ModuleName,Isnull(ParentID,0) ParentID,ModuleLevel, 'No Access' Access  ,isnull(children,0)as Children
  from Module where moduleid not in ( select Module.ModuleId
from Module  Left outer Join
 GroupPermission on Module.ModuleId=GroupPermission.ModuleID where GroupId=@GroupId ) 
 order by ParentId asc
END


GO