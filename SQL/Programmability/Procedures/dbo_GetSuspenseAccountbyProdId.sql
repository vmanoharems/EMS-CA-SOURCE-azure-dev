SET QUOTED_IDENTIFIER, ANSI_NULLS ON
GO

CREATE PROCEDURE [dbo].[GetSuspenseAccountbyProdId]
@ProdId int ,

@Type nvarchar(50),
@ParentId int

As
BEGIN

	SET NOCOUNT ON;

    -- Insert statements for procedure here

	if(@Type='Ledger')
	begin
select * from TblAccounts where SegmentType = @Type and ProdId= @ProdId
end
else begin

select * from TblAccounts where SegmentType = @Type and ParentId =@ParentId

end
END



GO