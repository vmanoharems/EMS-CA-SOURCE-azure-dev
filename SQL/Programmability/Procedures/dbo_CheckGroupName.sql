SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[CheckGroupName]
	-- Add the parameters for the stored procedure here
	@ProdId int,
	@GroupName nvarchar(50),
	@GroupId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here

	if(@GroupId=0)
	begin
	if exists(select * From CompanyGroup where Prodid=@ProdId and GroupName=@GroupName)
	begin
	select 1;
	end
	else begin 
	select 0;
	end
	end   
	else
	begin
	if exists(
	select * From CompanyGroup where Prodid=@ProdId and GroupName=@GroupName and GroupId<>@GroupId )
	begin
	select 1;
	end
	else
	begin
	select 0;
	end
	end
END



GO