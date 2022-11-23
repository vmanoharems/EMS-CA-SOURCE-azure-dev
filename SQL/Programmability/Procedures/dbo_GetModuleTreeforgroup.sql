SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetModuleTreeforgroup]  
	@GroupId int
AS
BEGIN
	
Declare @Mtree TABLE (ModuleId Int,ModuleName Varchar(50),Parentid Int,Modulelevel Int,Access Varchar(30),Children int)

Insert into @Mtree

	exec [dbo].[GetModulesDetails] @GroupId;
	
DECLARE @Data TABLE (ModuleID int, Count int)

INSERT INTO @Data

 select ParentId,Count(ParentId) as Count   from @Mtree where ParentId>0 group by ParentId;



 declare @t table (
CHILD int ,ModuleName Varchar(50),Parent Int,Modulelevel Int,Access Varchar(30),Childcount INt)

insert into @t 
select a.Moduleid,a.ModuleName,a.Parentid,a.ModuleLevel,a.Access,isnull(d.count,0) as Childcount from @Mtree a Left Outer Join @Data d on a.Moduleid=d.Moduleid 


;with n(CHILD, ModuleName,PARENT,Modulelevel,Access, GENERATION, hierarchy,ChildCount) as (
select CHILD,ModuleName,Parent,Modulelevel,Access,0, CAST(CHILD as nvarchar) as GENERATION,ChildCount  from @t 
where Parent=0
union all
select  nplus1.CHILD, nplus1.ModuleName, nplus1.Parent, nplus1.Modulelevel,nplus1.Access,GENERATION+1, 
cast(n.hierarchy + '>' + CAST(nplus1.CHILD as nvarchar) as nvarchar),nplus1.ChildCount
 from 
@t as nplus1 inner join n on nplus1.Parent=n.CHILD  
)
select CHILD, ModuleName,PARENT,Modulelevel,Access, GENERATION, hierarchy,ChildCount
from n 
order by hierarchy



END



GO