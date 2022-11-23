SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[InsertUpdateGroupCompanyAccess]
	-- Add the parameters for the stored procedure here
	@GroupId int,
	@Company nvarchar(max),
	@ProdId int,
	@CreatedBy int
AS
BEGIN
	
	
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	delete from GroupCompanyAccess where GroupID=@GroupId

	declare @CCount int

	SELECT @CCount= Count(*) FROM dbo.SplitId(@Company,',')
	
--------------------------------------------------------
DECLARE Group_company CURSOR FOR 

SELECT items FROM dbo.SplitId(@Company,',')

OPEN Group_company
declare @COMPANYITEM INT
FETCH NEXT FROM Group_company 
INTO @COMPANYITEM

WHILE @@FETCH_STATUS = 0
BEGIN
  
  	
insert into GroupCompanyAccess(GroupID,CompanyID,ProdID,CreatedBy,CreatedDate) values(@GroupId,@COMPANYITEM,@ProdId,@CreatedBy,GETDATE())
FETCH NEXT FROM Group_company 
INTO @COMPANYITEM
   end
    

    CLOSE Group_company
    
DEALLOCATE Group_company




END



GO